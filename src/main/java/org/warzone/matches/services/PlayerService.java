package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.entities.persistence.Player;
import org.warzone.matches.repositories.PlayerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

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

    public List<Player> getAvailablePlayers(int teamId) {
        return playerRepository.findAvailableForTeam(teamId);
    }
}
