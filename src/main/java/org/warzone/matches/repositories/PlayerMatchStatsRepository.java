package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.PlayerMatchStats;
import java.util.List;

public interface PlayerMatchStatsRepository extends JpaRepository<PlayerMatchStats, Integer>{

    List<PlayerMatchStats> findByMatch_Tournament_Id(String tournamentId);

    List<PlayerMatchStats> findByMatch_IdMatches(int matchId);
}
