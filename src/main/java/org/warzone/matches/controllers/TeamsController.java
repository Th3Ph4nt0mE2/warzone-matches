package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.warzone.matches.entities.persistence.Teams;

import java.io.IOException;
import org.warzone.matches.services.TeamsService;

import java.util.List;

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
                .map(team -> {
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

    @PutMapping("/{id}")
    public ResponseEntity<Teams> updateTeam(@PathVariable int id, @RequestBody Teams teamDetails) {
        return teamsService.getTeamById(id)
                .map(team -> {
                    team.setName(teamDetails.getName());
                    // Note: Updating the list of players is a complex operation.
                    // A simple setPlayers might lead to unintended side effects
                    // depending on the cascade and ownership settings.
                    // For now, we only update the name.
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
}
