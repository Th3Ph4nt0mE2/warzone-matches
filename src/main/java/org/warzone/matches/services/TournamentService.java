package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.dto.TeamSummaryDTO;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.entities.persistence.PlayerMatchStats;
import org.warzone.matches.entities.persistence.Teams;
import org.warzone.matches.repositories.PlayerMatchStatsRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    @Autowired
    private PlayerMatchStatsRepository playerMatchStatsRepository;

    public List<TeamSummaryDTO> getTournamentSummary(int tournamentId) {
        // This will be implemented in the next step. For now, this is a placeholder.
        List<PlayerMatchStats> allStats = playerMatchStatsRepository.findByMatch_Tournament(tournamentId);

        // Step 1: Group stats by player and sum their kills
        Map<Player, Long> playerKills = allStats.stream()
                .collect(Collectors.groupingBy(
                        PlayerMatchStats::getPlayer,
                        Collectors.summingLong(PlayerMatchStats::getKills)
                ));

        // Step 2: Aggregate player kills into team totals
        Map<Teams, TeamSummaryDTO> teamSummaries = new HashMap<>();
        playerKills.forEach((player, kills) -> {
            player.getTeams().forEach(team -> {
                // Get or create the DTO for the team
                TeamSummaryDTO summary = teamSummaries.computeIfAbsent(
                    team,
                    t -> new TeamSummaryDTO(t.getName(), 0L, new ArrayList<>())
                );
                // Update the team's total kills and player list
                summary.setTotalKills(summary.getTotalKills() + kills);
                if (!summary.getPlayers().contains(player.getName())) {
                    summary.getPlayers().add(player.getName());
                }
            });
        });

        // Step 3: Convert map to a list and sort by total kills
        return teamSummaries.values().stream()
                .sorted((s1, s2) -> Long.compare(s2.getTotalKills(), s1.getTotalKills()))
                .collect(Collectors.toList());
    }
}
