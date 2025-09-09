package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.Tournament;

public interface TournamentRepository extends JpaRepository<Tournament, String> {

}
