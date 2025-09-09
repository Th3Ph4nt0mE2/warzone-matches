package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.warzone.matches.entities.persistence.Teams;
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

    @PostMapping
    public Teams createTeam(@RequestBody Teams team) {
        // Note: Creating a team with players in the request body should work
        // due to the CascadeType.ALL on the @ManyToMany relationship.
        return teamsService.saveTeam(team);
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
