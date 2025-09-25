package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.entities.persistence.Matches;
import org.warzone.matches.repositories.MatchesRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MatchesService {

    @Autowired
    private MatchesRepository matchesRepository;

    public List<Matches> getAllMatches() {
        return matchesRepository.findAll();
    }

    public Optional<Matches> getMatchById(int id) {
        return matchesRepository.findById(id);
    }

    public Matches saveMatch(Matches match) {
        return matchesRepository.save(match);
    }

    public void deleteMatch(int id) {
        matchesRepository.deleteById(id);
    }
}
