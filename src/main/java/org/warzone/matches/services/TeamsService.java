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
public class TeamsService {

    @Autowired
    private TeamsRepository teamsRepository;

    @Autowired
    private PlayerRepository playerRepository;

    public List<Teams> getAllTeams() {
        return teamsRepository.findAll();
    }

    public Optional<Teams> getTeamById(int id) {
        return teamsRepository.findById(id);
    }

    public Teams saveTeam(Teams team) {
        return teamsRepository.save(team);
    }

    public void deleteTeam(int id) {
        teamsRepository.deleteById(id);
    }

    public Optional<Player> addPlayerToTeam(int teamId, int playerId) {
        Optional<Teams> teamOptional = teamsRepository.findById(teamId);
        Optional<Player> playerOptional = playerRepository.findById(playerId);

        if (teamOptional.isPresent() && playerOptional.isPresent()) {
            Teams team = teamOptional.get();
            Player player = playerOptional.get();

            player.setTeam(team);
            playerRepository.save(player);
            return Optional.of(player);
        }
        return Optional.empty();
    }

    public Optional<Player> removePlayerFromTeam(int teamId, int playerId) {
        Optional<Player> playerOptional = playerRepository.findById(playerId);

        if (playerOptional.isPresent()) {
            Player player = playerOptional.get();
            if (player.getTeam() != null && player.getTeam().getIdTeams() == teamId) {
                player.setTeam(null);
                playerRepository.save(player);
            }
            return Optional.of(player);
        }
        return Optional.empty();
    }
}
