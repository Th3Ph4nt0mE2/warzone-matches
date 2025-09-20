package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.entities.persistence.Teams;
import org.warzone.matches.repositories.PlayerRepository;
import org.warzone.matches.repositories.TeamsRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamsRepository teamsRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Optional<Player> getPlayerById(int id) {
        return playerRepository.findById(id);
    }

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    public void deletePlayer(int id) {
        playerRepository.deleteById(id);
    }

    public List<Player> getAvailablePlayers(String tournamentId) {
        return playerRepository.findAvailableForTournament(tournamentId);
    }

    public Player createPlayerForTeam(Player player, int teamId) {
        Optional<Teams> teamOpt = teamsRepository.findById(teamId);
        if (teamOpt.isPresent()) {
            player.setMainTeam(teamOpt.get());
            return playerRepository.save(player);
        } else {
            // Or throw a custom exception e.g., TeamNotFoundException
            throw new RuntimeException("Team not found with id: " + teamId);
        }
    }
}
