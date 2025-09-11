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

    public Optional<Teams> addPlayerToTeam(int teamId, int playerId) {
        Optional<Teams> teamOptional = teamsRepository.findById(teamId);
        Optional<Player> playerOptional = playerRepository.findById(playerId);

        if (teamOptional.isPresent() && playerOptional.isPresent()) {
            Teams team = teamOptional.get();
            Player player = playerOptional.get();

            if (!team.getPlayers().contains(player)) {
                team.getPlayers().add(player);
                teamsRepository.save(team);
            }
            return Optional.of(team);
        }
        return Optional.empty();
    }

    public Optional<Teams> removePlayerFromTeam(int teamId, int playerId) {
        Optional<Teams> teamOptional = teamsRepository.findById(teamId);

        if (teamOptional.isPresent()) {
            Teams team = teamOptional.get();
            boolean removed = team.getPlayers().removeIf(player -> player.getIdPlayer() == playerId);

            if (removed) {
                teamsRepository.save(team);
            }
            return Optional.of(team);
        }
        return Optional.empty();
    }
}
