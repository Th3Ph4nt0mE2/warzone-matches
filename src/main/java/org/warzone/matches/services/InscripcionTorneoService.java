package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.entities.persistence.InscripcionTorneo;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.entities.persistence.Teams;
import org.warzone.matches.entities.persistence.Tournament;
import org.warzone.matches.repositories.InscripcionTorneoRepository;
import org.warzone.matches.repositories.PlayerRepository;
import org.warzone.matches.repositories.TeamsRepository;
import org.warzone.matches.repositories.TournamentRepository;

import org.springframework.data.domain.PageRequest;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class InscripcionTorneoService {

    @Autowired
    private InscripcionTorneoRepository inscripcionTorneoRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TeamsRepository teamsRepository;

    @Autowired
    private PlayerRepository playerRepository;

    public Optional<InscripcionTorneo> createInscripcion(String tournamentId, int teamId, int playerId, String role) {
        Optional<Tournament> tournamentOpt = tournamentRepository.findById(tournamentId.toUpperCase());
        Optional<Teams> teamOpt = teamsRepository.findById(teamId);
        Optional<Player> playerOpt = playerRepository.findById(playerId);

        if (tournamentOpt.isPresent() && teamOpt.isPresent() && playerOpt.isPresent()) {
            InscripcionTorneo inscripcion = new InscripcionTorneo();
            inscripcion.setTournament(tournamentOpt.get());
            inscripcion.setTeam(teamOpt.get());
            inscripcion.setPlayer(playerOpt.get());
            inscripcion.setRole(role);

            return Optional.of(inscripcionTorneoRepository.save(inscripcion));
        }

        return Optional.empty();
    }

    public void deleteInscripcion(String tournamentId, int teamId, int playerId) {
        Optional<InscripcionTorneo> inscripcionOpt = inscripcionTorneoRepository.findByTournament_IdAndTeam_IdTeamsAndPlayer_IdPlayer(tournamentId.toUpperCase(), teamId, playerId);
        inscripcionOpt.ifPresent(inscripcion -> inscripcionTorneoRepository.deleteById(inscripcion.getId()));
    }

    public List<InscripcionTorneo> getRoster(String tournamentId, int teamId) {
        return inscripcionTorneoRepository.findByTournamentIdAndTeamIdTeams(tournamentId.toUpperCase(), teamId);
    }

    public List<InscripcionTorneo> getLatestRosterForTeam(int teamId) {
        List<String> latestTournamentIds = inscripcionTorneoRepository.findLatestTournamentIdByTeamId(teamId, PageRequest.of(0, 1));

        if (latestTournamentIds.isEmpty()) {
            return Collections.emptyList();
        }

        String latestTournamentId = latestTournamentIds.get(0);
        return getRoster(latestTournamentId, teamId);
    }

    public List<Teams> getTeamsByTournamentId(String tournamentId) {
        List<InscripcionTorneo> inscriptions = inscripcionTorneoRepository.findByTournament_Id(tournamentId.toUpperCase());
        return inscriptions.stream()
                .map(InscripcionTorneo::getTeam)
                .distinct()
                .collect(java.util.stream.Collectors.toList());
    }
}
