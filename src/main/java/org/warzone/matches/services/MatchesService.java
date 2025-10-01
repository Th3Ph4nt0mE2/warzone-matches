package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.entities.persistence.Matches;
import org.warzone.matches.repositories.MatchesRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class MatchesService {

    private static final Map<Integer, Double> POSITION_MULTIPLIERS;

    static {
        POSITION_MULTIPLIERS = Collections.unmodifiableMap(Stream.of(new Object[][] {
                { 1, 2.0 }, { 2, 1.8 }, { 3, 1.8 }, { 4, 1.8 }, { 5, 1.6 },
                { 6, 1.6 }, { 7, 1.6 }, { 8, 1.6 }, { 9, 1.0 }, { 10, 1.0 },
                { 11, 1.0 }, { 12, 1.0 }, { 13, 1.0 }, { 14, 1.0 }, { 15, 1.0 }
        }).collect(Collectors.toMap(data -> (Integer) data[0], data -> (Double) data[1])));
    }

    @Autowired
    private MatchesRepository matchesRepository;

    @Autowired
    private PlayerMatchStatsRepository playerMatchStatsRepository;

    public List<Matches> getAllMatches() {
        return matchesRepository.findAll();
    }

    public Optional<Matches> getMatchById(int id) {
        return matchesRepository.findById(id);
    }

    public Matches saveMatch(Matches match) {
        // When a match is saved, we should calculate its score.
        // However, player stats might not be available yet.
        // This method will be called to update the score later.
        return matchesRepository.save(match);
    }

    public Matches updateMatchScore(int matchId) {
        Optional<Matches> matchOptional = matchesRepository.findById(matchId);
        if (matchOptional.isPresent()) {
            Matches match = matchOptional.get();

            // 1. Calculate total kills for this match
            int totalKills = playerMatchStatsRepository.findAllByMatchId(matchId).stream()
                    .mapToInt(stat -> stat.getKills())
                    .sum();

            // 2. Get the position multiplier
            double multiplier = POSITION_MULTIPLIERS.getOrDefault(match.getTop(), 0.0);

            // 3. Calculate and set the total score
            double score = totalKills * multiplier;
            match.setTotal(score);

            // 4. Save the updated match
            return matchesRepository.save(match);
        }
        // Or throw an exception
        return null;
    }

    public void deleteMatch(int id) {
        matchesRepository.deleteById(id);
    }
}
