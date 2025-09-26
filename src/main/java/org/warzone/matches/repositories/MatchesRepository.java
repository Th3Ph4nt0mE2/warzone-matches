package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.Matches;

import java.util.List;

public interface MatchesRepository extends JpaRepository<Matches, Integer> {
    List<Matches> findByTournament_Id(String tournamentId);
}
