document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation and View Elements ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = {
        'view-tournaments-link': document.getElementById('tournaments-list-view'),
        'register-tournament-link': document.getElementById('register-tournament-view'),
        'register-team-link': document.getElementById('register-team-view'),
        'register-player-link': document.getElementById('register-player-view'),
    };

    // --- Main Content Elements ---
    const viewTitle = document.getElementById('view-title');
    const tournamentsListUL = document.getElementById('tournaments-list-ul');
    const summaryContent = document.getElementById('summary-content');

    // --- Form Elements ---
    const tournamentForm = document.getElementById('register-tournament-form');
    const teamForm = document.getElementById('register-team-form');
    const playerForm = document.getElementById('register-player-form');

    // --- Dropdown Menu Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('main-dropdown-menu');

    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
        if (!dropdownMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        }
    });


    // --- View Management ---
    function showView(viewId) {
        Object.values(views).forEach(view => {
            if (view) view.style.display = 'none';
        });
        navLinks.forEach(link => link.classList.remove('active'));

        const targetView = views[viewId];
        const activeLink = document.getElementById(viewId);

        if (targetView) {
            targetView.style.display = 'block';
            if (activeLink) {
                activeLink.classList.add('active');
                viewTitle.textContent = activeLink.textContent;
            }
        }
    }

    // --- Event Listeners for Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showView(link.id);
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        });
    });

    // --- Generic Form Submission Handler (for JSON) ---
    async function handleFormSubmit(event, url, body) {
        event.preventDefault();
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register.');
            }
            alert('Registration successful!');
            event.target.reset();
            showView('view-tournaments-link');
            fetchTournaments();
        } catch (error) {
            console.error(`Error during registration at ${url}:`, error);
            alert(`Error: ${error.message}`);
        }
    }

    // --- Event Listeners for Forms ---
    tournamentForm.addEventListener('submit', (e) => {
        const body = { name: document.getElementById('tournament-name').value };
        handleFormSubmit(e, '/api/tournaments', body);
    });

    // CUSTOM HANDLER FOR TEAM FORM (with file upload)
    teamForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('team-name').value);

        const logoInput = document.getElementById('team-logo');
        if (logoInput.files.length > 0) {
            formData.append('logo', logoInput.files[0]);
        }

        try {
            const response = await fetch('/api/teams', {
                method: 'POST',
                body: formData, // No Content-Type header needed; browser sets it
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register team.');
            }
            alert('Team registration successful!');
            e.target.reset();
            showView('view-tournaments-link');
            fetchTournaments();
        } catch (error) {
            console.error('Error during team registration:', error);
            alert(`Error: ${error.message}`);
        }
    });

    playerForm.addEventListener('submit', (e) => {
        const body = {
            name: document.getElementById('player-name').value,
            nickname: document.getElementById('player-nickname').value,
            role: document.getElementById('player-role').value,
        };
        handleFormSubmit(e, '/api/players', body);
    });


    // --- Existing Tournament List and Summary Logic ---
    async function fetchTournaments() {
        try {
            const response = await fetch('/api/tournaments');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const tournaments = await response.json();
            displayTournaments(tournaments);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            tournamentsListUL.innerHTML = '<li class="list-group-item list-group-item-danger">Failed to load tournaments.</li>';
        }
    }
    function displayTournaments(tournaments) {
        tournamentsListUL.innerHTML = '';
        if (tournaments.length === 0) {
            tournamentsListUL.innerHTML = '<li class="list-group-item">No tournaments found.</li>';
            return;
        }
        tournaments.forEach(tournament => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item list-group-item-action';
            listItem.textContent = `${tournament.name} (Status: ${tournament.status})`;
            listItem.dataset.id = tournament.id;
            listItem.addEventListener('click', () => fetchTournamentSummary(tournament.id));
            tournamentsListUL.appendChild(listItem);
        });
    }
    async function fetchTournamentSummary(tournamentId) {
        summaryContent.innerHTML = '<p>Loading summary...</p>';
        try {
            const response = await fetch(`/api/tournaments/${tournamentId}/summary`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const summary = await response.json();
            displayTournamentSummary(summary);
        } catch (error) {
            console.error(`Error fetching summary for tournament ${tournamentId}:`, error);
            summaryContent.innerHTML = '<p class="text-danger">Failed to load tournament summary.</p>';
        }
    }

    // MODIFIED to display logos
    function displayTournamentSummary(summary) {
        if (!summary || summary.length === 0) {
            summaryContent.innerHTML = '<p>No summary data available for this tournament.</p>';
            return;
        }
        const table = document.createElement('table');
        table.className = 'table table-striped';
        const thead = document.createElement('thead');
        thead.innerHTML = `<tr><th>Logo</th><th>Team</th><th>Members</th><th>Total Kills</th></tr>`;
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        summary.forEach(teamSummary => {
            const row = document.createElement('tr');

            const logoCell = document.createElement('td');
            const logoImg = document.createElement('img');
            logoImg.src = `/api/teams/${teamSummary.teamId}/logo`;
            logoImg.alt = `${teamSummary.teamName} Logo`;
            logoImg.style.width = '50px';
            logoImg.style.height = '50px';
            logoImg.onerror = () => { logoImg.style.display = 'none'; }; // Hide if no logo
            logoCell.appendChild(logoImg);
            row.appendChild(logoCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = teamSummary.teamName;
            row.appendChild(nameCell);

            const membersCell = document.createElement('td');
            membersCell.textContent = teamSummary.members.join(', ');
            row.appendChild(membersCell);

            const killsCell = document.createElement('td');
            killsCell.textContent = teamSummary.totalKills;
            row.appendChild(killsCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        summaryContent.innerHTML = '';
        summaryContent.appendChild(table);
    }

    // --- Initial Setup ---
    showView('view-tournaments-link'); // Show the default view
    fetchTournaments(); // Initial fetch of tournaments
});
