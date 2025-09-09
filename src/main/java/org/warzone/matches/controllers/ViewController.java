package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.warzone.matches.services.TournamentService;

@Controller
@RequestMapping("/view")
public class ViewController {

    @Autowired
    private TournamentService tournamentService;

    @GetMapping("/tournaments")
    public String showTournamentsPage(Model model) {
        model.addAttribute("tournaments", tournamentService.getAllTournaments());
        return "tournaments"; // This corresponds to tournaments.html
    }

    @GetMapping("/tournaments/{id}/summary")
    public String showTournamentSummaryPage(@PathVariable String id, Model model) {
        // Fetch the tournament to display its name on the summary page
        tournamentService.getTournamentById(id).ifPresent(tournament -> {
            model.addAttribute("tournament", tournament);
        });

        // Fetch the summary data
        model.addAttribute("summary", tournamentService.getTournamentSummary(id));
        return "summary"; // This corresponds to summary.html
    }
}
