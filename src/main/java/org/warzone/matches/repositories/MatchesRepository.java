package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.Matches;

public interface MatchesRepository extends JpaRepository<Matches, Integer>{

}
