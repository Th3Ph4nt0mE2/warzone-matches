package org.warzone.matches.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.warzone.matches.entities.persistence.InscripcionTorneo;

import java.util.List;
import java.util.Optional;

public interface InscripcionTorneoRepository extends JpaRepository<InscripcionTorneo, Long> {

    List<InscripcionTorneo> findByTournament_Id(String tournamentId);

    List<InscripcionTorneo> findByTournamentIdAndTeamIdTeams(String tournamentId, int teamId);

    Optional<InscripcionTorneo> findByTournament_IdAndTeam_IdTeamsAndPlayer_IdPlayer(String tournamentId, int teamId, int playerId);

    @Query("SELECT i.tournament.id FROM InscripcionTorneo i WHERE i.team.idTeams = :teamId ORDER BY i.tournament.id DESC")
    List<String> findLatestTournamentIdByTeamId(@Param("teamId") int teamId, Pageable pageable);
}
