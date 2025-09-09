package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.warzone.matches.dto.TeamSummaryDTO;
import org.warzone.matches.entities.persistence.Tournament;
import org.warzone.matches.services.TournamentService;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

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
}
