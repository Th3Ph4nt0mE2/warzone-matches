package org.warzone.matches.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.entities.persistence.Teams;
import org.warzone.matches.entities.persistence.Tournament;
import org.warzone.matches.services.PlayerService;
import org.warzone.matches.services.TeamsService;
import org.warzone.matches.services.TournamentService;

@Controller
@RequestMapping("/view")
public class ViewController {

    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private TeamsService teamsService;

    @Autowired
    private PlayerService playerService;

    @GetMapping("/tournaments")
    public String showTournamentsPage(Model model) {
        model.addAttribute("tournaments", tournamentService.getAllTournaments());
        return "tournaments";
    }

    @GetMapping("/tournaments/{id}/summary")
    public String showTournamentSummaryPage(@PathVariable String id, Model model) {
        tournamentService.getTournamentById(id).ifPresent(tournament -> {
            model.addAttribute("tournament", tournament);
        });
        model.addAttribute("summary", tournamentService.getTournamentSummary(id));
        return "summary";
    }

    // --- Register Tournament ---
    @GetMapping("/register/tournament")
    public String showRegisterTournamentForm(Model model) {
        model.addAttribute("tournament", new Tournament());
        return "register-tournament";
    }

    @PostMapping("/register/tournament")
    public String registerTournament(@ModelAttribute Tournament tournament) {
        tournamentService.saveTournament(tournament);
        return "redirect:/view/tournaments";
    }

    // --- Register Team ---
    @GetMapping("/register/team")
    public String showRegisterTeamForm(Model model) {
        model.addAttribute("team", new Teams());
        return "register-team";
    }

    @PostMapping("/register/team")
    public String registerTeam(@ModelAttribute Teams team) {
        teamsService.saveTeam(team);
        return "redirect:/view/tournaments";
    }

    // --- Register Player ---
    @GetMapping("/register/player")
    public String showRegisterPlayerForm(Model model) {
        model.addAttribute("player", new Player());
        return "register-player";
    }

    @PostMapping("/register/player")
    public String registerPlayer(@ModelAttribute Player player) {
        playerService.savePlayer(player);
        return "redirect:/view/tournaments";
    }
}
