package org.warzone.matches.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.entities.persistence.Teams;
import org.warzone.matches.services.TeamsService;

@RestController
@RequestMapping("/api/teams")
public class TeamsController {

    @Autowired
    private TeamsService teamsService;

    @GetMapping
    public List<Teams> getAllTeams() {
        return teamsService.getAllTeams();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teams> getTeamById(@PathVariable int id) {
        return teamsService.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public Teams createTeam(@RequestParam("name") String name, @RequestParam(value = "logo", required = false) MultipartFile logoFile) throws IOException {
        Teams newTeam = new Teams();
        newTeam.setName(name);
        if (logoFile != null && !logoFile.isEmpty()) {
            newTeam.setLogo(logoFile.getBytes());
        }
        // Note: This simplified endpoint does not handle adding players during team creation.
        return teamsService.saveTeam(newTeam);
    }

    @GetMapping("/{id}/logo")
    public ResponseEntity<byte[]> getTeamLogo(@PathVariable int id) {
        return teamsService.getTeamById(id)
                .<ResponseEntity<byte[]>>map(team -> {
                    if (team.getLogo() != null && team.getLogo().length > 0) {
                        return ResponseEntity.ok()
                                .contentType(MediaType.IMAGE_JPEG) // Assuming JPEG, could be PNG etc.
                                .body(team.getLogo());
                    } else {
                        return ResponseEntity.notFound().build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Teams> updateTeam(@PathVariable int id, @RequestParam("name") String name, @RequestParam(value = "logo", required = false) MultipartFile logoFile) {
        return teamsService.getTeamById(id)
                .map(team -> {
                    team.setName(name);
                    if (logoFile != null && !logoFile.isEmpty()) {
                        try {
                            team.setLogo(logoFile.getBytes());
                        } catch (IOException e) {
                            // In a real app, handle this exception more gracefully
                            throw new RuntimeException("Failed to store file.", e);
                        }
                    }
                    Teams updatedTeam = teamsService.saveTeam(team);
                    return ResponseEntity.ok(updatedTeam);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable int id) {
        return teamsService.getTeamById(id)
                .map(team -> {
                    teamsService.deleteTeam(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/players")
    public ResponseEntity<List<Player>> getPlayersForTeam(@PathVariable int id) {
        return teamsService.getTeamById(id)
                .map(team -> ResponseEntity.ok(team.getPlayers()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{teamId}/players/{playerId}")
    public ResponseEntity<Player> addPlayerToTeam(@PathVariable int teamId, @PathVariable int playerId) {
        return teamsService.addPlayerToTeam(teamId, playerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{teamId}/players/{playerId}")
    public ResponseEntity<Player> removePlayerFromTeam(@PathVariable int teamId, @PathVariable int playerId) {
        return teamsService.removePlayerFromTeam(teamId, playerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
