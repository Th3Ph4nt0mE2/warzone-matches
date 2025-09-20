document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/warzone-matches';

    // --- Element Selectors ---
    const navLinks = {
        summary: document.getElementById('nav-summary'),
        tournaments: document.getElementById('nav-tournaments'),
        teams: document.getElementById('nav-teams'),
        settings: document.getElementById('nav-settings'),
    };
    const views = {
        summary: document.getElementById('summary-view'),
        tournaments: document.getElementById('tournaments-view'),
        teams: document.getElementById('teams-view'),
        settings: document.getElementById('settings-view'),
        registerTournament: document.getElementById('register-tournament-view'),
        registerTeam: document.getElementById('register-team-view'),
        registerPlayer: document.getElementById('register-player-view'),
    };
    const viewTitle = document.getElementById('view-title');
    const dropdownMenu = document.getElementById('main-dropdown-menu');
    const menuToggle = document.getElementById('menu-toggle');

    // Containers
    const tournamentsListContainer = document.getElementById('tournaments-list-container');
    const tournamentDetailsContainer = document.getElementById('tournament-details-container');
    const teamsListContainer = document.getElementById('teams-list-container');
    const teamDetailsContainer = document.getElementById('team-details-container');

    // Forms
    const tournamentForm = document.getElementById('register-tournament-form');
    const teamForm = document.getElementById('register-team-form');
    const playerForm = document.getElementById('register-player-form');

    // Modal elements
    const addPlayerModalElement = document.getElementById('add-player-modal');
    const availablePlayersList = document.getElementById('available-players-list');
    const addSelectedPlayerButton = document.getElementById('add-selected-player-button');
    const playerRoleAssignInput = document.getElementById('player-role-assign');
    let addPlayerModal; // To be initialized when first shown

    // State variables
    let selectedTournamentId = null;
    let selectedTeamIdForRoster = null; // For tournament rosters
    let selectedTeamIdForManagement = null; // For main team management
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

    navLinks.summary.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('summary', 'Summary', null);
    });
    navLinks.tournaments.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments);
    });
    navLinks.teams.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('teams', 'Team Management', fetchAndDisplayTeams);
    });
    navLinks.settings.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick('settings', 'Settings', null);
    });

    // --- "Create" Button Logic ---
    document.getElementById('show-register-tournament-form').addEventListener('click', () => {
        tournamentForm.reset();
        showView('registerTournament');
    });
    document.getElementById('show-register-team-form').addEventListener('click', () => {
        teamForm.reset();
        showView('registerTeam');
    });

    // --- "Cancel" Button Logic ---
    document.getElementById('cancel-register-tournament').addEventListener('click', () => {
        handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments);
    });
    document.getElementById('cancel-register-team').addEventListener('click', () => {
        handleNavClick('teams', 'Team Management', fetchAndDisplayTeams);
    });
    document.getElementById('cancel-register-player').addEventListener('click', () => {
        // This button now always returns to the team management view
        handleNavClick('teams', 'Team Management', fetchAndDisplayTeams);
    });

    // --- Event Listeners ---

    // Listener for the Tournaments List
    tournamentsListContainer.addEventListener('click', (e) => {
        const link = e.target.closest('.tournament-link');
        if (link) {
            e.preventDefault();
            const currentlySelected = tournamentsListContainer.querySelector('.active');
            if (currentlySelected) currentlySelected.classList.remove('active');
            link.classList.add('active');
            selectedTournamentId = link.dataset.id;
            showTournamentDetails(selectedTournamentId);
        }
    });

    // Listener for the Teams List (Team Management View)
    teamsListContainer.addEventListener('click', (e) => {
        const link = e.target.closest('.team-link');
        if(link) {
            e.preventDefault();
            const currentlySelected = teamsListContainer.querySelector('.active');
            if (currentlySelected) currentlySelected.classList.remove('active');
            link.classList.add('active');
            selectedTeamIdForManagement = link.dataset.id;
            fetchAndDisplayMainRoster(selectedTeamIdForManagement);
        }
    });

    // Listener for the main roster details (in Team Management view)
    teamDetailsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-player-to-main-roster-btn')) {
            playerForm.reset();
            document.getElementById('player-form-title').textContent = 'Create New Player';
            // The selectedTeamIdForManagement is already set by the teamsListContainer listener
            showView('registerPlayer');
        }
    });

    // Listener for the Tournament Details container (Tournament View)
    tournamentDetailsContainer.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('registered-team-link')) {
            e.preventDefault();
            const teamId = target.dataset.teamId;
            const rosterContainer = document.getElementById(`roster-for-team-${teamId}`);
            if (rosterContainer) {
                const isVisible = rosterContainer.style.display === 'block';
                rosterContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible && rosterContainer.innerHTML.trim() === '') {
                    fetchAndDisplayTournamentRoster(selectedTournamentId, teamId, rosterContainer);
                }
            }
        }
        if (target.classList.contains('show-add-player-modal-button')) {
            selectedTeamIdForRoster = target.dataset.teamId;
            // ... (rest of modal logic is the same)
        }
        // ... (other event handlers for tournament details view)
    });

    // ... (modal listener logic remains the same)

    // --- Data Fetching & Display ---

    // Tournaments View Functions
    async function fetchAndDisplayTournaments() {
        tournamentsListContainer.innerHTML = '<h2>Tournaments</h2><p>Loading...</p>';
        tournamentDetailsContainer.innerHTML = '<p class="text-muted">Select a tournament to see its details.</p>';
        try {
            const response = await fetch(`${API_BASE}/api/tournaments`);
            if (!response.ok) throw new Error('Failed to fetch tournaments');
            const tournaments = await response.json();
            let listHtml = '<h2>Tournaments</h2><div class="list-group">';
            if (tournaments.length === 0) {
                listHtml += '<div class="list-group-item">No tournaments found.</div>';
            } else {
                tournaments.forEach(t => {
                    listHtml += `<a href="#" class="list-group-item list-group-item-action tournament-link" data-id="${t.id}">${t.name} <span class="badge bg-secondary">${t.status}</span></a>`;
                });
            }
            listHtml += '</div>';
            tournamentsListContainer.innerHTML = listHtml;
        } catch (error) {
            tournamentsListContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
        }
    }

    async function showTournamentDetails(tournamentId) {
        tournamentDetailsContainer.innerHTML = '<p>Loading tournament details...</p>';
        try {
            const response = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/teams`);
            if (!response.ok) throw new Error('Failed to fetch registered teams.');
            const teams = await response.json();
            let detailsHtml = '<h3>Registered Teams</h3>';
            if (teams.length === 0) {
                detailsHtml += '<p>No teams are registered for this tournament yet.</p>';
            } else {
                detailsHtml += '<div class="accordion">';
                teams.forEach(team => {
                    detailsHtml += `
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed registered-team-link" type="button" data-team-id="${team.idTeams}">${team.name}</button>
                            </h2>
                            <div id="roster-for-team-${team.idTeams}" class="accordion-collapse collapse">
                                <div class="accordion-body"><!-- Roster will be loaded here --></div>
                            </div>
                        </div>`;
                });
                detailsHtml += '</div>';
            }
            tournamentDetailsContainer.innerHTML = detailsHtml;
        } catch (error) {
            tournamentDetailsContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
        }
    }

    async function fetchAndDisplayTournamentRoster(tournamentId, teamId, rosterContainer) {
        // ... (this function is the same as the old 'fetchAndDisplayRoster')
    }

    // Teams (Team Management) View Functions
    async function fetchAndDisplayTeams() {
        teamsListContainer.innerHTML = '<h2>Teams</h2><p>Loading...</p>';
        teamDetailsContainer.innerHTML = '<p class="text-muted">Select a team to see its main roster.</p>';
        try {
            const response = await fetch(`${API_BASE}/api/teams`);
            if (!response.ok) throw new Error('Failed to fetch teams');
            const teams = await response.json();
            let listHtml = '<h2>Teams</h2><div class="list-group">';
            if (teams.length === 0) {
                listHtml += '<div class="list-group-item">No teams found. Create one!</div>';
            } else {
                teams.forEach(team => {
                    listHtml += `<a href="#" class="list-group-item list-group-item-action team-link" data-id="${team.idTeams}">${team.name}</a>`;
                });
            }
            listHtml += '</div>';
            teamsListContainer.innerHTML = listHtml;
        } catch (error) {
            teamsListContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
        }
    }

    async function fetchAndDisplayMainRoster(teamId) {
        teamDetailsContainer.innerHTML = '<p>Loading main roster...</p>';
        try {
            const response = await fetch(`${API_BASE}/api/teams/${teamId}/roster`);
            if (!response.ok) throw new Error('Failed to fetch main roster.');
            const roster = await response.json();
            let detailsHtml = '<h3>Main Roster</h3>';
            if (roster.length === 0) {
                detailsHtml += '<p>This team has no players in its main roster.</p>';
            } else {
                detailsHtml += '<ul class="list-group">';
                roster.forEach(player => {
                    detailsHtml += `<li class="list-group-item">${player.name} (${player.nickname})</li>`;
                });
                detailsHtml += '</ul>';
            }
            detailsHtml += `<button class="btn btn-success mt-3 add-player-to-main-roster-btn" data-team-id="${teamId}">Add New Player to Main Roster</button>`;
            teamDetailsContainer.innerHTML = detailsHtml;
        } catch (error) {
            teamDetailsContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
        }
    }

    // --- Form Submission Logic ---
    tournamentForm.addEventListener('submit', (e) => {
        const body = { name: document.getElementById('tournament-name').value, status: 'PLANNED' };
        handleJsonSubmit(e, `${API_BASE}/api/tournaments`, body, 'POST', () => handleNavClick('tournaments', 'Tournaments', fetchAndDisplayTournaments));
    });

    teamForm.addEventListener('submit', (e) => {
        const formData = new FormData(e.target);
        handleMultipartSubmit(e, `${API_BASE}/api/teams`, formData, 'POST', () => handleNavClick('teams', 'Team Management', fetchAndDisplayTeams));
    });

    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const teamId = selectedTeamIdForManagement;
        if (!teamId) {
            alert('No team selected to add the player to.');
            return;
        }
        const body = {
            name: document.getElementById('player-name').value,
            nickname: document.getElementById('player-nickname').value
        };
        const url = `${API_BASE}/api/teams/${teamId}/players`;
        handleJsonSubmit(e, url, body, 'POST', () => {
            // After creating player, refresh the main roster view
            fetchAndDisplayMainRoster(teamId);
            showView('teams'); // Go back to the teams view
        });
    });

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
            if(successCallback) successCallback();
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
            if(successCallback) successCallback();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    // --- Initial Setup ---
    handleNavClick('summary', 'Summary', null);
});
