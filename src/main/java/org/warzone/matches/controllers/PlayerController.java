package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.services.PlayerService;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/available")
    public List<Player> getAvailablePlayers(@RequestParam int teamId) {
        return playerService.getAvailablePlayers(teamId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable int id) {
        return playerService.getPlayerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Player createPlayer(@RequestBody Player player) {
        return playerService.savePlayer(player);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable int id, @RequestBody Player playerDetails) {
        return playerService.getPlayerById(id)
                .map(player -> {
                    player.setName(playerDetails.getName());
                    player.setNickname(playerDetails.getNickname());
                    player.setRole(playerDetails.getRole());
                    // Note: This does not handle updating the 'teams' relationship.
                    // That would require a more complex implementation.
                    Player updatedPlayer = playerService.savePlayer(player);
                    return ResponseEntity.ok(updatedPlayer);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable int id) {
        return playerService.getPlayerById(id)
                .map(player -> {
                    playerService.deletePlayer(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
