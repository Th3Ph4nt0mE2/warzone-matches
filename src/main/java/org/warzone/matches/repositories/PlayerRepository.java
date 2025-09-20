package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.warzone.matches.entities.persistence.Player;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Integer> {

    @Query("SELECT p FROM Player p WHERE p.idPlayer NOT IN (SELECT i.player.idPlayer FROM InscripcionTorneo i WHERE i.tournament.id = :tournamentId)")
    List<Player> findAvailableForTournament(@Param("tournamentId") String tournamentId);
}
