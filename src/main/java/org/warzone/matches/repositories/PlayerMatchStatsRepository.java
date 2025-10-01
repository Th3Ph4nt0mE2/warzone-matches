package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.PlayerMatchStats;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PlayerMatchStatsRepository extends JpaRepository<PlayerMatchStats, Integer>{

    List<PlayerMatchStats> findByMatch_Tournament_Id(String tournamentId);

    @Query("SELECT p FROM PlayerMatchStats p WHERE p.match.idMatches = :matchId")
    List<PlayerMatchStats> findAllByMatchId(@Param("matchId") int matchId);
}
