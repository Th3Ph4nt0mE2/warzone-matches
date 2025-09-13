package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.warzone.matches.entities.persistence.Player;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Integer> {

    @Query("SELECT p FROM Player p WHERE p.team IS NULL OR p.team.idTeams != :teamId")
    List<Player> findAvailableForTeam(@Param("teamId") int teamId);
}
