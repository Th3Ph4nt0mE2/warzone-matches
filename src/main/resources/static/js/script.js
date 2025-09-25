document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/warzone-matches';

    // --- Element Selectors ---
    const navLinks = {
        summary: document.getElementById('nav-summary'),
        tournaments: document.getElementById('nav-tournaments'),
        teams: document.getElementById('nav-teams'),
        players: document.getElementById('nav-players'),
        settings: document.getElementById('nav-settings'),
    };
    const views = {
        summary: document.getElementById('summary-view'),
        tournaments: document.getElementById('tournaments-view'),
        teams: document.getElementById('teams-view'),
        players: document.getElementById('players-view'),
        settings: document.getElementById('settings-view'),
        registerTournament: document.getElementById('register-tournament-view'),
        registerTeam: document.getElementById('register-team-view'),
        registerPlayer: document.getElementById('register-player-view'),
    };
    const viewTitle = document.getElementById('view-title');
    const dropdownMenu = document.getElementById('main-dropdown-menu');
    const menuToggle = document.getElementById('menu-toggle');

    // List containers
    const tournamentsListContainer = document.getElementById('tournaments-list-container');
    const teamsListContainer = document.getElementById('teams-list-container');
    const teamDetailsContainer = document.getElementById('team-details-container');
    const playersList = document.getElementById('players-list');

    // Forms
    const tournamentForm = document.getElementById('register-tournament-form');
    const teamForm = document.getElementById('register-team-form');
    const playerForm = document.getElementById('register-player-form');

    // Form UI elements for editing
    const playerFormTitle = document.getElementById('player-form-title');
    const playerFormSubmitButton = playerForm.querySelector('button[type="submit"]');
    const hiddenPlayerId = document.getElementById('player-id-edit');

    const teamFormTitle = document.getElementById('team-form-title');
    const teamFormSubmitButton = teamForm.querySelector('button[type="submit"]');
    const hiddenTeamId = document.getElementById('team-id-edit');

    const tournamentFormTitle = document.getElementById('tournament-form-title');
    const tournamentFormSubmitButton = tournamentForm.querySelector('button[type="submit"]');
    const hiddenTournamentId = document.getElementById('tournament-id-edit');

    // Modal elements
    const addPlayerModalElement = document.getElementById('add-player-modal');
    const availablePlayersList = document.getElementById('available-players-list');
    const addSelectedPlayerButton = document.getElementById('add-selected-player-button');
    let addPlayerModal; // To be initialized when first shown
    let selectedTeamId = null;
    let selectedPlayerId = null;
    let selectedAvailablePlayerId = null;


    // --- View Management ---
    function showView(viewKey) {
        for (const key in views) {
            if (views[key]) views[key].style.display = 'none';
        }
        if (views[viewKey]) {
            views[viewKey].style.display = 'block';
        }
    }

    // --- Dropdown Menu Logic ---
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    window.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });

    // --- Navigation ---
    function handleNavClick(viewKey, title, fetchCallback) {
        showView(viewKey);
        viewTitle.textContent = title;
        if (fetchCallback) fetchCallback();
        for (const key in navLinks) {
            if (navLinks[key]) navLinks[key].classList.remove('active');
        }
        if (navLinks[viewKey]) {
            navLinks[viewKey].classList.add('active');
        }
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    }

    navLinks.tournaments.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments);
    });
    navLinks.teams.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('teams', 'Teams', fetchAndDisplayTeams);
    });
    navLinks.players.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('players', 'Players', fetchAndDisplayPlayers);
    });

    navLinks.summary.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('summary', 'Summary', null); // No fetch callback for summary yet
    });

    navLinks.settings.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('settings', 'Settings', null); // No fetch callback for settings yet
    });

    // --- "Create" Button Logic ---
    document.getElementById('show-register-tournament-form').addEventListener('click', () => {
        resetTournamentForm();
        showView('registerTournament');
    });
    document.getElementById('show-register-team-form').addEventListener('click', () => {
        resetTeamForm();
        showView('registerTeam');
    });
    document.getElementById('show-register-player-form').addEventListener('click', () => {
        resetPlayerForm();
        showView('registerPlayer');
    });

    // --- "Cancel" Button Logic ---
    document.getElementById('cancel-register-tournament').addEventListener('click', () => {
        resetTournamentForm();
        handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments);
    });
    document.getElementById('cancel-register-team').addEventListener('click', () => {
        resetTeamForm();
        handleNavClick('teams', 'Teams', fetchAndDisplayTeams);
    });
    document.getElementById('cancel-register-player').addEventListener('click', () => {
        resetPlayerForm();
        handleNavClick('players', 'Players', fetchAndDisplayPlayers);
    });

    // --- List Click Handlers (Event Delegation) ---
    playersList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('.list-group-item');
        if (listItem && !target.closest('.player-actions')) {
            const currentlySelected = playersList.querySelector('.selected');
            if (currentlySelected && currentlySelected !== listItem) {
                currentlySelected.classList.remove('selected');
            }
            listItem.classList.toggle('selected');
        }
        if (target.classList.contains('edit-player')) handleEditPlayer(target.dataset.id);
        else if (target.classList.contains('delete-player')) handleDeletePlayer(target.dataset.id);
    });

    // New listener for the master team list
    teamsListContainer.addEventListener('click', e => {
        e.preventDefault();
        const link = e.target.closest('.team-list-item');
        if (link) {
            const currentActive = teamsListContainer.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            link.classList.add('active');

            const teamId = link.dataset.teamId;
            const teamName = link.dataset.teamName;
            fetchAndDisplayTeamPlayers(teamId, teamName);
        }
    });

    // New listener for the team details pane (for edit/delete buttons, and player management)
    teamDetailsContainer.addEventListener('click', async (e) => {
        const target = e.target;

        // --- Handle selecting a player from the team list ---
        if (target.classList.contains('team-member-item')) {
            e.preventDefault();
            const removeButton = document.getElementById('remove-selected-player-button');
            const currentlySelected = teamDetailsContainer.querySelector('.team-member-item.active');

            if (currentlySelected && currentlySelected === target) {
                // Deselect if clicking the same item
                target.classList.remove('active');
                selectedPlayerId = null;
                removeButton.style.display = 'none';
            } else {
                // Select the new item
                if (currentlySelected) {
                    currentlySelected.classList.remove('active');
                }
                target.classList.add('active');
                selectedPlayerId = target.dataset.playerId;
                removeButton.dataset.teamId = document.querySelector('.team-list-item.active').dataset.teamId;
                removeButton.style.display = 'inline-block';
            }
        }

        // --- Handle "Remove Selected Player" button click ---
        if (target.id === 'remove-selected-player-button') {
            if (!selectedPlayerId) return;
            const teamId = target.dataset.teamId;
            if (confirm(`Are you sure you want to remove this player from the team?`)) {
                try {
                    const response = await fetch(`${API_BASE}/api/teams/${teamId}/players/${selectedPlayerId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) throw new Error('Failed to remove player.');
                    alert('Player removed successfully.');
                    const teamName = document.querySelector('.team-list-item.active').dataset.teamName;
                    fetchAndDisplayTeamPlayers(teamId, teamName);
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            }
        }

        // --- Handle "Add Player" button click (to show modal) ---
        if (target.id === 'show-add-player-modal-button') {
            const teamId = target.dataset.teamId;
            selectedTeamId = teamId;

            availablePlayersList.innerHTML = '<p>Loading available players...</p>';
            addSelectedPlayerButton.disabled = true;
            selectedAvailablePlayerId = null;

            if (!addPlayerModal) {
                addPlayerModal = new bootstrap.Modal(addPlayerModalElement);
            }
            addPlayerModal.show();

            try {
                const response = await fetch(`${API_BASE}/api/players/available?teamId=${teamId}`);
                if (!response.ok) throw new Error('Could not fetch available players.');
                const availablePlayers = await response.json();

                let playersHtml = '';
                if (availablePlayers.length === 0) {
                    playersHtml = '<p class="text-muted">No available players found.</p>';
                } else {
                    availablePlayers.forEach(player => {
                        playersHtml += `<a href="#" class="list-group-item list-group-item-action available-player-item" data-player-id="${player.idPlayer}">${player.name} (${player.nickname})</a>`;
                    });
                }
                availablePlayersList.innerHTML = playersHtml;
            } catch (error) {
                availablePlayersList.innerHTML = `<p class="text-danger">${error.message}</p>`;
            }
        }

        // Handle other clicks like edit/delete team
        if (target.classList.contains('edit-team')) handleEditTeam(target.dataset.id);
        else if (target.classList.contains('delete-team')) handleDeleteTeam(target.dataset.id);
    });

    // --- Logic for the modal itself ---
    addPlayerModalElement.addEventListener('click', (e) => {
        const target = e.target;

        // Handle selecting a player from the available list
        if (target.classList.contains('available-player-item')) {
            e.preventDefault();
            const currentlySelected = addPlayerModalElement.querySelector('.available-player-item.active');
            if (currentlySelected) {
                currentlySelected.classList.remove('active');
            }
            target.classList.add('active');
            selectedAvailablePlayerId = target.dataset.playerId;
            addSelectedPlayerButton.disabled = false;
        }

        // Handle the final "Add Selected Player" button click
        if (target.id === 'add-selected-player-button') {
            if (!selectedAvailablePlayerId || !selectedTeamId) return;

            fetch(`${API_BASE}/api/teams/${selectedTeamId}/players/${selectedAvailablePlayerId}`, {
                method: 'POST'
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add player to the team.');
                }
                return response.json();
            }).then(() => {
                alert('Player added successfully!');
                addPlayerModal.hide();
                const teamName = document.querySelector('.team-list-item.active').dataset.teamName;
                fetchAndDisplayTeamPlayers(selectedTeamId, teamName);
            }).catch(error => {
                alert(`Error: ${error.message}`);
            });
        }
    });

    tournamentsListContainer.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('.list-group-item');

        if (listItem && !target.closest('.player-actions')) {
            const currentlySelected = tournamentsListContainer.querySelector('.selected');
            if (currentlySelected && currentlySelected !== listItem) {
                currentlySelected.classList.remove('selected');
            }
            listItem.classList.toggle('selected');
        }

        if (target.classList.contains('tournament-link')) {
            e.preventDefault();
            fetchTournamentSummary(target.dataset.id);
        }
        if (target.classList.contains('edit-tournament')) handleEditTournament(target.dataset.id);
        else if (target.classList.contains('delete-tournament')) handleDeleteTournament(target.dataset.id);
    });

    // --- Data Fetching and Display ---
    async function fetchAndDisplayTournaments() {
        tournamentsListContainer.innerHTML = '<h2>Tournaments</h2><p>Loading...</p>';
        try {
            const response = await fetch(`${API_BASE}/api/tournaments`);
            if (!response.ok) throw new Error('Failed to fetch tournaments');
            const tournaments = await response.json();

            let listHtml = '<ul class="list-group">';
            if (tournaments.length === 0) {
                listHtml += '<li class="list-group-item">No tournaments found.</li>';
            } else {
                tournaments.forEach(t => {
                    listHtml += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <a href="#" class="tournament-link" data-id="${t.id}">${t.name} (${t.status})</a>
                            <div class="player-actions">
                                <button class="btn btn-sm btn-secondary me-2 edit-tournament" data-id="${t.id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-tournament" data-id="${t.id}">Delete</button>
                            </div>
                        </li>`;
                });
            }
            listHtml += '</ul><div id="tournament-summary-container" class="mt-4"></div>';
            tournamentsListContainer.innerHTML = listHtml;
        } catch (error) {
            tournamentsListContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
        }
    }
    async function fetchTournamentSummary(tournamentId) {
        const summaryContainer = document.getElementById('tournament-summary-container');
        summaryContainer.innerHTML = '<p>Loading summary...</p>';
        try {
            const response = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/summary`);
            if (!response.ok) throw new Error('Failed to fetch summary');
            const summary = await response.json();

            if (!summary || summary.length === 0) {
                summaryContainer.innerHTML = '<p>No summary data available.</p>';
                return;
            }
            let tableHtml = '<h3>Tournament Summary</h3><table class="table table-striped"><thead><tr><th>Logo</th><th>Team</th><th>Members</th><th>Total Kills</th></tr></thead><tbody>';
            summary.forEach(ts => {
                tableHtml += `<tr>
                    <td><img src="${API_BASE}/api/teams/${ts.teamId}/logo" alt="${ts.teamName}" style="width: 50px; height: 50px;" onerror="this.style.display='none'"></td>
                    <td>${ts.teamName}</td>
                    <td>${ts.members.join(', ')}</td>
                    <td>${ts.totalKills}</td>
                </tr>`;
            });
            tableHtml += '</tbody></table>';
            summaryContainer.innerHTML = tableHtml;

        } catch (error) {
            summaryContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
        }
    }

    async function fetchAndDisplayTeams() {
        teamsListContainer.innerHTML = '<p>Loading teams...</p>';
        // Clear details view when reloading the list
        teamDetailsContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Team Details</h5>
                    <p class="card-text">Select a team from the list to see its players.</p>
                </div>
            </div>`;
        try {
            const response = await fetch(`${API_BASE}/api/teams`, { cache: 'no-cache' });
            if (!response.ok) throw new Error('Failed to fetch teams');
            const teams = await response.json();

            let listHtml = `
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">All Teams</h5>
                    </div>
                    <ul class="list-group list-group-flush">`;

            if (teams.length === 0) {
                listHtml += '<li class="list-group-item">No teams found.</li>';
            } else {
                teams.forEach(team => {
                    listHtml += `
                        <a href="#" class="list-group-item list-group-item-action team-list-item" data-team-id="${team.idTeams}" data-team-name="${team.name}">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h5 class="mb-1 d-flex align-items-center">
                                    <img src="${API_BASE}/api/teams/${team.idTeams}/logo" alt="" class="me-2" style="width: 30px; height: 30px; border-radius: 50%;" onerror="this.style.display='none'">
                                    ${team.name}
                                </h5>
                            </div>
                        </a>`;
                });
            }
            listHtml += '</ul></div>';
            teamsListContainer.innerHTML = listHtml;
        } catch (error) {
            teamsListContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    }

    async function fetchAndDisplayTeamPlayers(teamId, teamName) {
        teamDetailsContainer.innerHTML = '<p>Loading players...</p>';
        try {
            const playersResponse = await fetch(`${API_BASE}/api/teams/${teamId}/players`);
            if (!playersResponse.ok) throw new Error(`Failed to fetch players for team ${teamName}`);
            const players = await playersResponse.json();

            let detailsHtml = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Players in ${teamName}</h5>
                        <div>
                            <button class="btn btn-secondary btn-sm me-2 edit-team" data-id="${teamId}">Edit Team</button>
                            <button class="btn btn-danger btn-sm delete-team" data-id="${teamId}">Delete Team</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush" id="team-player-list">`;

            if (players.length === 0) {
                detailsHtml += '<li class="list-group-item">This team has no players yet.</li>';
            } else {
                players.forEach(player => {
                    detailsHtml += `
                        <a href="#" class="list-group-item list-group-item-action team-member-item" data-player-id="${player.idPlayer}">
                            ${player.name} (${player.nickname}) - Role: ${player.role}
                        </a>`;
                });
            }

            detailsHtml += `
                        </ul>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-success btn-sm" id="show-add-player-modal-button" data-team-id="${teamId}">Add Player</button>
                        <button class="btn btn-danger btn-sm" id="remove-selected-player-button" style="display: none;">Remove Selected Player</button>
                    </div>
                </div>`;
            teamDetailsContainer.innerHTML = detailsHtml;

        } catch (error) {
            teamDetailsContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    }

    async function fetchAndDisplayPlayers() {
        playersList.innerHTML = '<p>Loading players...</p>';
        try {
            const response = await fetch(`${API_BASE}/api/players`);
            if (!response.ok) throw new Error('Failed to fetch players');
            const players = await response.json();

            playersList.innerHTML = '';
            if (players.length === 0) {
                playersList.innerHTML = '<li class="list-group-item">No players found.</li>';
            } else {
                players.forEach(player => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';

                    const playerInfo = document.createElement('span');
                    playerInfo.textContent = `${player.name} (${player.nickname}) - Role: ${player.role}`;

                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'player-actions';

                    const editButton = document.createElement('button');
                    editButton.className = 'btn btn-sm btn-secondary me-2 edit-player';
                    editButton.textContent = 'Edit';
                    editButton.dataset.id = player.idPlayer;
                    buttonsDiv.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'btn btn-sm btn-danger delete-player';
                    deleteButton.textContent = 'Delete';
                    deleteButton.dataset.id = player.idPlayer;
                    buttonsDiv.appendChild(deleteButton);

                    li.appendChild(playerInfo);
                    li.appendChild(buttonsDiv);
                    playersList.appendChild(li);
                });
            }
        } catch (error) {
            playersList.innerHTML = `<li class="list-group-item text-danger">${error.message}</li>`;
        }
    }

    // --- Delete Logic ---
    async function handleDeletePlayer(playerId) {
        if (!confirm(`Are you sure you want to delete player ${playerId}?`)) return;
        try {
            const response = await fetch(`${API_BASE}/api/players/${playerId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete player.');
            alert('Player deleted successfully!');
            fetchAndDisplayPlayers();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
    async function handleDeleteTeam(teamId) {
        if (!confirm(`Are you sure you want to delete team ${teamId}?`)) return;
        try {
            const response = await fetch(`${API_BASE}/api/teams/${teamId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete team.');
            alert('Team deleted successfully!');
            // After deleting, refresh the whole teams view
            fetchAndDisplayTeams();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
    async function handleDeleteTournament(tournamentId) {
        if (!confirm(`Are you sure you want to delete tournament ${tournamentId}?`)) return;
        try {
            const response = await fetch(`${API_BASE}/api/tournaments/${tournamentId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete tournament.');
            alert('Tournament deleted successfully!');
            fetchAndDisplayTournaments();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    // --- Edit Logic ---
    async function handleEditPlayer(playerId) {
        try {
            const response = await fetch(`${API_BASE}/api/players/${playerId}`);
            if (!response.ok) throw new Error('Failed to fetch player data.');
            const player = await response.json();
            hiddenPlayerId.value = player.idPlayer;
            document.getElementById('player-name').value = player.name;
            document.getElementById('player-nickname').value = player.nickname;
            document.getElementById('player-role').value = player.role;
            playerFormTitle.textContent = 'Edit Player';
            playerFormSubmitButton.textContent = 'Update';
            showView('registerPlayer');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
    async function handleEditTeam(teamId) {
        try {
            const response = await fetch(`${API_BASE}/api/teams/${teamId}`);
            if (!response.ok) throw new Error('Failed to fetch team data.');
            const team = await response.json();
            hiddenTeamId.value = team.idTeams;
            document.getElementById('team-name').value = team.name;
            // Note: Does not show existing logo, just allows replacing it.
            teamFormTitle.textContent = 'Edit Team';
            teamFormSubmitButton.textContent = 'Update';
            showView('registerTeam');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
    async function handleEditTournament(tournamentId) {
        try {
            const response = await fetch(`${API_BASE}/api/tournaments/${tournamentId}`);
            if (!response.ok) throw new Error('Failed to fetch tournament data.');
            const tournament = await response.json();
            hiddenTournamentId.value = tournament.id;
            document.getElementById('tournament-name').value = tournament.name;
            document.getElementById('tournament-status-edit').value = tournament.status;
            tournamentFormTitle.textContent = 'Edit Tournament';
            tournamentFormSubmitButton.textContent = 'Update';
            showView('registerTournament');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    // --- Form Reset Logic ---
    function resetPlayerForm() {
        playerForm.reset();
        hiddenPlayerId.value = '';
        playerFormTitle.textContent = 'Register Player';
        playerFormSubmitButton.textContent = 'Register';
    }
    function resetTeamForm() {
        teamForm.reset();
        hiddenTeamId.value = '';
        teamFormTitle.textContent = 'Register Team';
        teamFormSubmitButton.textContent = 'Register';
    }
    function resetTournamentForm() {
        tournamentForm.reset();
        hiddenTournamentId.value = '';
        tournamentFormTitle.textContent = 'Register Tournament';
        tournamentFormSubmitButton.textContent = 'Register';
    }

    // --- Form Submission Logic ---
    async function handleJsonSubmit(event, url, body, method, successCallback) {
        event.preventDefault();
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error(await response.text());
            alert('Operation successful!');
            event.target.reset();
            successCallback();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    async function handleMultipartSubmit(event, url, formData, method, successCallback) {
        event.preventDefault();
        try {
            const response = await fetch(url, { method: method, body: formData });
            if (!response.ok) throw new Error(await response.text());
            alert('Operation successful!');
            event.target.reset();
            successCallback();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    tournamentForm.addEventListener('submit', (e) => {
        const tournamentId = hiddenTournamentId.value;
        const body = {
            name: document.getElementById('tournament-name').value,
            status: document.getElementById('tournament-status-edit').value
        };
        if (tournamentId) {
            handleJsonSubmit(e, `${API_BASE}/api/tournaments/${tournamentId}`, body, 'PUT', () => {
                resetTournamentForm();
                handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments);
            });
        } else {
            delete body.status;
            handleJsonSubmit(e, `${API_BASE}/api/tournaments`, body, 'POST', () => handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments));
        }
    });
    teamForm.addEventListener('submit', (e) => {
        const teamId = hiddenTeamId.value;
        const formData = new FormData();
        formData.append('name', document.getElementById('team-name').value);
        const logoInput = document.getElementById('team-logo');
        if (logoInput.files.length > 0) {
            formData.append('logo', logoInput.files[0]);
        }

        if (teamId) {
            handleMultipartSubmit(e, `${API_BASE}/api/teams/${teamId}`, formData, 'PUT', () => {
                resetTeamForm();
                handleNavClick('teams', 'Teams', fetchAndDisplayTeams);
            });
        } else {
            handleMultipartSubmit(e, `${API_BASE}/api/teams`, formData, 'POST', () => handleNavClick('teams', 'Teams', fetchAndDisplayTeams));
        }
    });
    playerForm.addEventListener('submit', (e) => {
        const playerId = hiddenPlayerId.value;
        const body = {
            name: document.getElementById('player-name').value,
            nickname: document.getElementById('player-nickname').value,
            role: document.getElementById('player-role').value,
        };

        if (playerId) {
            handleJsonSubmit(e, `${API_BASE}/api/players/${playerId}`, body, 'PUT', () => {
                resetPlayerForm();
                handleNavClick('players', 'Players', fetchAndDisplayPlayers);
            });
        } else {
            handleJsonSubmit(e, `${API_BASE}/api/players`, body, 'POST', () => handleNavClick('players', 'Players', fetchAndDisplayPlayers));
        }
    });

    // --- Initial Setup ---
    handleNavClick('summary', 'Summary', null); // Load Summary view by default
});
