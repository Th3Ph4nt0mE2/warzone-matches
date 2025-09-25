package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.dto.TeamSummaryDTO;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.entities.persistence.PlayerMatchStats;
import org.warzone.matches.entities.persistence.Teams;
import org.warzone.matches.entities.persistence.Tournament;
import org.warzone.matches.repositories.PlayerMatchStatsRepository;
import org.warzone.matches.repositories.TournamentRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private PlayerMatchStatsRepository playerMatchStatsRepository;

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
        List<PlayerMatchStats> allStats = playerMatchStatsRepository.findByMatch_Tournament_Id(normalizedTournamentId);

        Map<Player, Long> playerKills = allStats.stream()
                .collect(Collectors.groupingBy(
                        PlayerMatchStats::getPlayer,
                        Collectors.summingLong(PlayerMatchStats::getKills)
                ));

        Map<Teams, TeamSummaryDTO> teamSummaries = new HashMap<>();
        playerKills.forEach((player, kills) -> {
            Teams team = player.getTeam();
            if (team != null) {
                TeamSummaryDTO summary = teamSummaries.computeIfAbsent(
                    team,
                    t -> new TeamSummaryDTO(t.getIdTeams(), t.getName(), 0L, new ArrayList<>())
                );
                summary.setTotalKills(summary.getTotalKills() + kills);
                if (!summary.getPlayers().contains(player.getName())) {
                    summary.getPlayers().add(player.getName());
                }
            }
        });

        return teamSummaries.values().stream()
                .sorted((s1, s2) -> Long.compare(s2.getTotalKills(), s1.getTotalKills()))
                .collect(Collectors.toList());
    }
}
