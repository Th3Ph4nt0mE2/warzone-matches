package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.dto.TeamSummaryDTO;
import org.warzone.matches.dto.TeamSummaryDTO;
import org.warzone.matches.entities.persistence.Matches;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.entities.persistence.Teams;
import org.warzone.matches.entities.persistence.Tournament;
import org.warzone.matches.repositories.MatchesRepository;
import org.warzone.matches.repositories.TournamentRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private MatchesRepository matchesRepository;

    // CRUD for Tournament
    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public Optional<Tournament> getTournamentById(String id) {
        return tournamentRepository.findById(id.toUpperCase());
    }

    public Tournament saveTournament(Tournament tournament) {
        tournament.setId(tournament.getId().toUpperCase());
        return tournamentRepository.save(tournament);
    }

    public void deleteTournament(String id) {
        tournamentRepository.deleteById(id.toUpperCase());
    }

    // Summary Logic
    public List<TeamSummaryDTO> getTournamentSummary(String tournamentId) {
        String normalizedTournamentId = tournamentId.toUpperCase();
        List<Matches> tournamentMatches = matchesRepository.findByTournament_Id(normalizedTournamentId);

        // Group matches by team
        Map<Teams, List<Matches>> matchesByTeam = tournamentMatches.stream()
                .filter(m -> m.getTeams() != null)
                .collect(Collectors.groupingBy(Matches::getTeams));

        // Calculate summary for each team
        List<TeamSummaryDTO> teamSummaries = matchesByTeam.entrySet().stream()
                .map(entry -> {
                    Teams team = entry.getKey();
                    List<Matches> teamMatches = entry.getValue();

                    // Sum the pre-calculated scores from each match
                    double totalPoints = teamMatches.stream()
                            .mapToDouble(Matches::getTotal)
                            .sum();

                    // Collect player names
                    List<String> playerNames = team.getPlayers().stream()
                            .map(Player::getName)
                            .distinct()
                            .collect(Collectors.toList());

                    return new TeamSummaryDTO(team.getIdTeams(), team.getName(), totalPoints, playerNames);
                })
                .collect(Collectors.toList());

        // Sort teams by total points in descending order
        return teamSummaries.stream()
                .sorted((s1, s2) -> Double.compare(s2.getTotalPoints(), s1.getTotalPoints()))
                .collect(Collectors.toList());
    }
}
