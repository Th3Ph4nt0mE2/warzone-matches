document.addEventListener('DOMContentLoaded', () => {
    const tournamentsList = document.querySelector('#tournaments-list .list-group');
    const summaryContent = document.getElementById('summary-content');

    // Function to fetch all tournaments
    async function fetchTournaments() {
        try {
            const response = await fetch('/api/tournaments');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tournaments = await response.json();
            displayTournaments(tournaments);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            tournamentsList.innerHTML = '<li class="list-group-item list-group-item-danger">Failed to load tournaments.</li>';
        }
    }

    // Function to display tournaments in the list
    function displayTournaments(tournaments) {
        tournamentsList.innerHTML = ''; // Clear existing list
        if (tournaments.length === 0) {
            tournamentsList.innerHTML = '<li class="list-group-item">No tournaments found.</li>';
            return;
        }

        tournaments.forEach(tournament => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item list-group-item-action';
            listItem.textContent = `${tournament.name} (Status: ${tournament.status})`;
            listItem.dataset.id = tournament.id; // Store tournament ID
            listItem.addEventListener('click', () => {
                fetchTournamentSummary(tournament.id);
            });
            tournamentsList.appendChild(listItem);
        });
    }

    // Function to fetch the summary for a specific tournament
    async function fetchTournamentSummary(tournamentId) {
        summaryContent.innerHTML = '<p>Loading summary...</p>';
        try {
            const response = await fetch(`/api/tournaments/${tournamentId}/summary`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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

        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Position</th>
                <th>Team</th>
                <th>Members</th>
                <th>Total Kills</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        summary.forEach(teamSummary => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teamSummary.position}</td>
                <td>${teamSummary.teamName}</td>
                <td>${teamSummary.members.join(', ')}</td>
                <td>${teamSummary.totalKills}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        summaryContent.innerHTML = ''; // Clear previous content
        summaryContent.appendChild(table);
    }

    // Initial fetch of tournaments when the page loads
    fetchTournaments();
});
