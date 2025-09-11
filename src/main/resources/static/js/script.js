document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/warzone-matches';

    // --- Element Selectors ---
    const navLinks = {
        tournaments: document.getElementById('nav-tournaments'),
        teams: document.getElementById('nav-teams'),
        players: document.getElementById('nav-players'),
    };
    const views = {
        tournaments: document.getElementById('tournaments-view'),
        teams: document.getElementById('teams-view'),
        players: document.getElementById('players-view'),
        registerTournament: document.getElementById('register-tournament-view'),
        registerTeam: document.getElementById('register-team-view'),
        registerPlayer: document.getElementById('register-player-view'),
    };
    const viewTitle = document.getElementById('view-title');
    const dropdownMenu = document.getElementById('main-dropdown-menu');
    const menuToggle = document.getElementById('menu-toggle');

    // List containers
    const tournamentsListContainer = document.getElementById('tournaments-list-container');
    const teamsList = document.getElementById('teams-list');
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

    teamsList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('.list-group-item');
        if (listItem && !target.closest('.player-actions')) {
            const currentlySelected = teamsList.querySelector('.selected');
            if (currentlySelected && currentlySelected !== listItem) {
                currentlySelected.classList.remove('selected');
            }
            listItem.classList.toggle('selected');
        }
        if (target.classList.contains('edit-team')) handleEditTeam(target.dataset.id);
        else if (target.classList.contains('delete-team')) handleDeleteTeam(target.dataset.id);
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
        teamsList.innerHTML = '<p>Loading teams...</p>';
        try {
            const response = await fetch(`${API_BASE}/api/teams`);
            if (!response.ok) throw new Error('Failed to fetch teams');
            const teams = await response.json();

            teamsList.innerHTML = '';
            if (teams.length === 0) {
                teamsList.innerHTML = '<li class="list-group-item">No teams found.</li>';
            } else {
                teams.forEach(team => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    const info = document.createElement('span');
                    info.className = 'd-flex align-items-center';
                    info.innerHTML = `<img src="${API_BASE}/api/teams/${team.idTeams}/logo" alt="" style="width: 40px; height: 40px; margin-right: 15px;" onerror="this.style.display='none'"> ${team.name}`;
                    const actions = document.createElement('div');
                    actions.className = 'player-actions';
                    actions.innerHTML = `<button class="btn btn-sm btn-secondary me-2 edit-team" data-id="${team.idTeams}">Edit</button><button class="btn btn-sm btn-danger delete-team" data-id="${team.idTeams}">Delete</button>`;
                    li.appendChild(info);
                    li.appendChild(actions);
                    teamsList.appendChild(li);
                });
            }
        } catch (error) {
            teamsList.innerHTML = `<li class="list-group-item text-danger">${error.message}</li>`;
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
        // The 'body' of a fetch request with multipart/form-data can't be sent with PUT in some environments.
        // A common workaround is to use POST and add a method override field.
        // For this app, we will assume the server supports PUT with multipart.
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
            // Remove status for create, as API handles it
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
    handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments);
});
