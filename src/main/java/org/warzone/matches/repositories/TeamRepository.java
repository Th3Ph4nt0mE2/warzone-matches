package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.Team;

public interface TeamRepository extends JpaRepository<Team, Integer>{

}
