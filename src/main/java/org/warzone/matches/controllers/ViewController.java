package org.warzone.matches.controllers;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
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

    // --- List Views ---
    @GetMapping("/tournaments")
    public String showTournamentsPage(Model model) {
        model.addAttribute("tournaments", tournamentService.getAllTournaments());
        return "tournaments";
    }

    @GetMapping("/teams")
    public String showTeamsPage(Model model) {
        model.addAttribute("teams", teamsService.getAllTeams());
        return "teams";
    }

    @GetMapping("/players")
    public String showPlayersPage(Model model) {
        model.addAttribute("players", playerService.getAllPlayers());
        return "players";
    }

    // --- Detail/Summary View ---
    @GetMapping("/tournaments/{id}/summary")
    public String showTournamentSummaryPage(@PathVariable String id, Model model) {
        tournamentService.getTournamentById(id).ifPresent(t -> model.addAttribute("tournament", t));
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
        // The API will handle setting the status.
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
    public String registerTeam(@RequestParam("name") String name, @RequestParam(value = "logo", required = false) MultipartFile logoFile) throws IOException {
        Teams newTeam = new Teams();
        newTeam.setName(name);
        if (logoFile != null && !logoFile.isEmpty()) {
            newTeam.setLogo(logoFile.getBytes());
        }
        teamsService.saveTeam(newTeam);
        return "redirect:/view/teams";
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
        return "redirect:/view/players";
    }
}
