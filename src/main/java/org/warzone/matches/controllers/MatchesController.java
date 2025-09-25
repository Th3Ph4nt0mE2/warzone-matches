package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.warzone.matches.entities.persistence.Matches;
import org.warzone.matches.services.MatchesService;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchesController {

    @Autowired
    private MatchesService matchesService;

    @GetMapping
    public List<Matches> getAllMatches() {
        return matchesService.getAllMatches();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matches> getMatchById(@PathVariable int id) {
        return matchesService.getMatchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Matches createMatch(@RequestBody Matches match) {
        return matchesService.saveMatch(match);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Matches> updateMatch(@PathVariable int id, @RequestBody Matches matchDetails) {
        return matchesService.getMatchById(id)
                .map(match -> {
                    match.setTournament(matchDetails.getTournament());
                    match.setMatch(matchDetails.getMatch());
                    match.setTeams(matchDetails.getTeams());
                    match.setTop(matchDetails.getTop());
                    match.setTotal(matchDetails.getTotal());
                    Matches updatedMatch = matchesService.saveMatch(match);
                    return ResponseEntity.ok(updatedMatch);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable int id) {
        return matchesService.getMatchById(id)
                .map(match -> {
                    matchesService.deleteMatch(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
