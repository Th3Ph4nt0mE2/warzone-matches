package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.warzone.matches.dto.TeamSummaryDTO;
import org.warzone.matches.services.TournamentService;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

    @GetMapping("/{id}/summary")
    public List<TeamSummaryDTO> getTournamentSummary(@PathVariable int id) {
        return tournamentService.getTournamentSummary(id);
    }
}
