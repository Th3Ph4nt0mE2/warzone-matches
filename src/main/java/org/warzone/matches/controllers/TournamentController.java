package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.warzone.matches.dto.InscripcionRequestDTO;
import org.warzone.matches.dto.TeamSummaryDTO;
import org.warzone.matches.entities.persistence.InscripcionTorneo;
import org.warzone.matches.entities.persistence.Tournament;
import org.warzone.matches.services.InscripcionTorneoService;
import org.warzone.matches.services.TournamentService;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private InscripcionTorneoService inscripcionTorneoService;

    // CRUD for Tournament
    @GetMapping
    public List<Tournament> getAllTournaments() {
        return tournamentService.getAllTournaments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable String id) {
        return tournamentService.getTournamentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tournament createTournament(@RequestBody Tournament tournament) {
        return tournamentService.saveTournament(tournament);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tournament> updateTournament(@PathVariable String id, @RequestBody Tournament tournamentDetails) {
        return tournamentService.getTournamentById(id)
                .map(tournament -> {
                    tournament.setName(tournamentDetails.getName());
                    tournament.setStatus(tournamentDetails.getStatus());
                    Tournament updatedTournament = tournamentService.saveTournament(tournament);
                    return ResponseEntity.ok(updatedTournament);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable String id) {
        return tournamentService.getTournamentById(id)
                .map(tournament -> {
                    tournamentService.deleteTournament(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Summary Endpoint
    @GetMapping("/{id}/summary")
    public List<TeamSummaryDTO> getTournamentSummary(@PathVariable String id) {
        return tournamentService.getTournamentSummary(id);
    }

    // New endpoint to get teams registered in a tournament
    @GetMapping("/{tournamentId}/teams")
    public List<org.warzone.matches.entities.persistence.Teams> getTeamsByTournament(@PathVariable String tournamentId) {
        return inscripcionTorneoService.getTeamsByTournamentId(tournamentId);
    }

    // Roster Management Endpoints
    @GetMapping("/{tournamentId}/teams/{teamId}/roster")
    public List<InscripcionTorneo> getTeamRoster(@PathVariable String tournamentId, @PathVariable int teamId) {
        return inscripcionTorneoService.getRoster(tournamentId, teamId);
    }

    @PostMapping("/{tournamentId}/teams/{teamId}/players")
    public ResponseEntity<InscripcionTorneo> addPlayerToRoster(
            @PathVariable String tournamentId,
            @PathVariable int teamId,
            @RequestBody InscripcionRequestDTO request) {
        return inscripcionTorneoService.createInscripcion(
                tournamentId,
                teamId,
                request.getPlayerId(),
                request.getRole())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{tournamentId}/teams/{teamId}/players/{playerId}")
    public ResponseEntity<Void> removePlayerFromRoster(
            @PathVariable String tournamentId,
            @PathVariable int teamId,
            @PathVariable int playerId) {
        inscripcionTorneoService.deleteInscripcion(tournamentId, teamId, playerId);
        return ResponseEntity.ok().build();
    }
}
