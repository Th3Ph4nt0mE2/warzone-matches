package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.entities.persistence.PlayerMatchStats;
import org.warzone.matches.repositories.PlayerMatchStatsRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerMatchStatsService {

    @Autowired
    private PlayerMatchStatsRepository playerMatchStatsRepository;

    public List<PlayerMatchStats> getAllPlayerMatchStats() {
        return playerMatchStatsRepository.findAll();
    }

    public Optional<PlayerMatchStats> getPlayerMatchStatsById(int id) {
        return playerMatchStatsRepository.findById(id);
    }

    public PlayerMatchStats savePlayerMatchStats(PlayerMatchStats playerMatchStats) {
        return playerMatchStatsRepository.save(playerMatchStats);
    }

    public void deletePlayerMatchStats(int id) {
        playerMatchStatsRepository.deleteById(id);
    }
}
