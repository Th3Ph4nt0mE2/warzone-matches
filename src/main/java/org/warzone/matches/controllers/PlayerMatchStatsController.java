package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.warzone.matches.entities.persistence.PlayerMatchStats;
import org.warzone.matches.services.PlayerMatchStatsService;

import java.util.List;

@RestController
@RequestMapping("/api/player-match-stats")
public class PlayerMatchStatsController {

    @Autowired
    private PlayerMatchStatsService playerMatchStatsService;

    @GetMapping
    public List<PlayerMatchStats> getAllPlayerMatchStats() {
        return playerMatchStatsService.getAllPlayerMatchStats();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerMatchStats> getPlayerMatchStatsById(@PathVariable int id) {
        return playerMatchStatsService.getPlayerMatchStatsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PlayerMatchStats createPlayerMatchStats(@RequestBody PlayerMatchStats playerMatchStats) {
        return playerMatchStatsService.savePlayerMatchStats(playerMatchStats);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerMatchStats> updatePlayerMatchStats(@PathVariable int id, @RequestBody PlayerMatchStats statsDetails) {
        return playerMatchStatsService.getPlayerMatchStatsById(id)
                .map(stats -> {
                    stats.setMatch(statsDetails.getMatch());
                    stats.setPlayer(statsDetails.getPlayer());
                    stats.setKills(statsDetails.getKills());
                    PlayerMatchStats updatedStats = playerMatchStatsService.savePlayerMatchStats(stats);
                    return ResponseEntity.ok(updatedStats);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayerMatchStats(@PathVariable int id) {
        return playerMatchStatsService.getPlayerMatchStatsById(id)
                .map(stats -> {
                    playerMatchStatsService.deletePlayerMatchStats(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
