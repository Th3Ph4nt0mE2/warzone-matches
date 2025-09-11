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
    async function fetchTournamentSummary(tournamentId) { /* ... unchanged ... */ }
    async function fetchAndDisplayTeams() { /* ... unchanged ... */ }
    async function fetchAndDisplayPlayers() { /* ... unchanged ... */ }

    // --- Delete Logic ---
    async function handleDeletePlayer(playerId) { /* ... unchanged ... */ }
    async function handleDeleteTeam(teamId) { /* ... unchanged ... */ }
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
    async function handleEditPlayer(playerId) { /* ... unchanged ... */ }
    async function handleEditTeam(teamId) { /* ... unchanged ... */ }
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
    function resetPlayerForm() { /* ... unchanged ... */ }
    function resetTeamForm() { /* ... unchanged ... */ }
    function resetTournamentForm() {
        tournamentForm.reset();
        hiddenTournamentId.value = '';
        tournamentFormTitle.textContent = 'Register Tournament';
        tournamentFormSubmitButton.textContent = 'Register';
    }

    // --- Form Submission Logic ---
    async function handleJsonSubmit(event, url, body, method, successCallback) { /* ... unchanged ... */ }
    async function handleMultipartSubmit(event, url, formData, method, successCallback) { /* ... unchanged ... */ }

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
            handleJsonSubmit(e, `${API_BASE}/api/tournaments`, body, 'POST', () => handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments));
        }
    });
    teamForm.addEventListener('submit', (e) => { /* ... unchanged ... */ });
    playerForm.addEventListener('submit', (e) => { /* ... unchanged ... */ });

    // --- Initial Setup ---
    handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments);
});
