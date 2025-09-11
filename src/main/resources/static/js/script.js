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
    const playerFormTitle = document.getElementById('player-form-title');
    const playerFormSubmitButton = playerForm.querySelector('button[type="submit"]');
    const hiddenPlayerId = document.getElementById('player-id-edit');

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
    document.getElementById('show-register-tournament-form').addEventListener('click', () => showView('registerTournament'));
    document.getElementById('show-register-team-form').addEventListener('click', () => showView('registerTeam'));
    document.getElementById('show-register-player-form').addEventListener('click', () => {
        resetPlayerForm();
        showView('registerPlayer');
    });

    // --- "Cancel" Button Logic ---
    document.getElementById('cancel-register-tournament').addEventListener('click', () => handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments));
    document.getElementById('cancel-register-team').addEventListener('click', () => handleNavClick('teams', 'Teams', fetchAndDisplayTeams));
    document.getElementById('cancel-register-player').addEventListener('click', () => {
        resetPlayerForm();
        handleNavClick('players', 'Players', fetchAndDisplayPlayers);
    });

    // --- Player List Edit/Delete Logic ---
    playersList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('edit-player')) {
            const playerId = target.dataset.id;
            handleEditPlayer(playerId);
        } else if (target.classList.contains('delete-player')) {
            const playerId = target.dataset.id;
            handleDeletePlayer(playerId);
        }
    });

    // --- Data Fetching and Display ---
    // (Tournament and Team functions are unchanged)
    async function fetchAndDisplayTournaments() {
        tournamentsListContainer.innerHTML = '<h2>Tournaments</h2><p>Loading...</p>';
        try {
            const response = await fetch(`${API_BASE}/api/tournaments`);
            if (!response.ok) throw new Error('Failed to fetch tournaments');
            const tournaments = await response.json();

            let listHtml = '<h2>Tournaments</h2><ul class="list-group">';
            if (tournaments.length === 0) {
                listHtml += '<li class="list-group-item">No tournaments found.</li>';
            } else {
                tournaments.forEach(t => {
                    listHtml += `<a href="#" class="list-group-item list-group-item-action" data-id="${t.id}">${t.name} (${t.status})</a>`;
                });
            }
            listHtml += '</ul><div id="tournament-summary-container" class="mt-4"></div>';
            tournamentsListContainer.innerHTML = listHtml;

            tournamentsListContainer.querySelectorAll('.list-group-item-action').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    fetchTournamentSummary(item.dataset.id);
                });
            });

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
                    li.className = 'list-group-item d-flex align-items-center';
                    li.innerHTML = `<img src="${API_BASE}/api/teams/${team.idTeams}/logo" alt="" style="width: 40px; height: 40px; margin-right: 15px;" onerror="this.style.display='none'"> ${team.name}`;
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

    async function handleDeletePlayer(playerId) {
        if (!confirm(`Are you sure you want to delete player ${playerId}?`)) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/api/players/${playerId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete player.');
            alert('Player deleted successfully!');
            fetchAndDisplayPlayers();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    async function handleEditPlayer(playerId) {
        try {
            const response = await fetch(`${API_BASE}/api/players/${playerId}`);
            if (!response.ok) throw new Error('Failed to fetch player data.');
            const player = await response.json();

            // Populate form
            hiddenPlayerId.value = player.idPlayer;
            document.getElementById('player-name').value = player.name;
            document.getElementById('player-nickname').value = player.nickname;
            document.getElementById('player-role').value = player.role;

            // Update UI for editing
            playerFormTitle.textContent = 'Edit Player';
            playerFormSubmitButton.textContent = 'Update';

            showView('registerPlayer');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    function resetPlayerForm() {
        playerForm.reset();
        hiddenPlayerId.value = '';
        playerFormTitle.textContent = 'Register Player';
        playerFormSubmitButton.textContent = 'Register';
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

    async function handleMultipartSubmit(event, url, formData, successCallback) {
        event.preventDefault();
        try {
            const response = await fetch(url, { method: 'POST', body: formData });
            if (!response.ok) throw new Error(await response.text());
            alert('Registration successful!');
            event.target.reset();
            successCallback();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    tournamentForm.addEventListener('submit', (e) => {
        const body = { name: document.getElementById('tournament-name').value };
        handleJsonSubmit(e, `${API_BASE}/api/tournaments`, body, 'POST', () => handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments));
    });

    teamForm.addEventListener('submit', (e) => {
        const formData = new FormData();
        formData.append('name', document.getElementById('team-name').value);
        const logoInput = document.getElementById('team-logo');
        if (logoInput.files.length > 0) formData.append('logo', logoInput.files[0]);
        handleMultipartSubmit(e, `${API_BASE}/api/teams`, formData, () => handleNavClick('teams', 'Teams', fetchAndDisplayTeams));
    });

    playerForm.addEventListener('submit', (e) => {
        const playerId = hiddenPlayerId.value;
        const body = {
            name: document.getElementById('player-name').value,
            nickname: document.getElementById('player-nickname').value,
            role: document.getElementById('player-role').value,
        };

        if (playerId) {
            // Update
            handleJsonSubmit(e, `${API_BASE}/api/players/${playerId}`, body, 'PUT', () => {
                resetPlayerForm();
                handleNavClick('players', 'Players', fetchAndDisplayPlayers);
            });
        } else {
            // Create
            handleJsonSubmit(e, `${API_BASE}/api/players`, body, 'POST', () => handleNavClick('players', 'Players', fetchAndDisplayPlayers));
        }
    });

    // --- Initial Setup ---
    handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments);
});
