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

    // --- View Management ---
    function showView(viewId) {
        // Hide all views
        Object.values(views).forEach(view => {
            if (view) view.style.display = 'none';
        });
        // Deactivate all nav links
        navLinks.forEach(link => link.classList.remove('active'));

        // Show the selected view and activate its link
        const targetView = views[viewId];
        if (targetView) {
            targetView.style.display = 'block';
            const activeLink = document.getElementById(viewId);
            if (activeLink) {
                activeLink.classList.add('active');
                // Update the main title based on the link's text
                viewTitle.textContent = activeLink.textContent;
            }
        }
    }

    // --- Event Listeners for Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showView(link.id);
        });
    });

    // --- Generic Form Submission Handler ---
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
            event.target.reset(); // Clear the form
            showView('view-tournaments-link'); // Go back to the list
            fetchTournaments(); // Refresh the list
        } catch (error) {
            console.error(`Error during registration at ${url}:`, error);
            alert(`Error: ${error.message}`);
        }
    }

    // --- Event Listeners for Forms ---
    tournamentForm.addEventListener('submit', (e) => {
        const body = {
            name: document.getElementById('tournament-name').value,
        };
        handleFormSubmit(e, '/api/tournaments', body);
    });

    teamForm.addEventListener('submit', (e) => {
        const body = {
            name: document.getElementById('team-name').value,
        };
        handleFormSubmit(e, '/api/teams', body);
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

    // Function to fetch all tournaments
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

    // Function to display tournaments in the list
    function displayTournaments(tournaments) {
        tournamentsListUL.innerHTML = ''; // Clear existing list
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

    // Function to fetch the summary for a specific tournament
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

    // Function to display the tournament summary in a table
    function displayTournamentSummary(summary) {
        if (!summary || summary.length === 0) {
            summaryContent.innerHTML = '<p>No summary data available for this tournament.</p>';
            return;
        }
        const table = document.createElement('table');
        table.className = 'table table-striped';
        const thead = document.createElement('thead');
        thead.innerHTML = `<tr><th>Position</th><th>Team</th><th>Members</th><th>Total Kills</th></tr>`;
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        summary.forEach(teamSummary => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${teamSummary.position}</td><td>${teamSummary.teamName}</td><td>${teamSummary.members.join(', ')}</td><td>${teamSummary.totalKills}</td>`;
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
