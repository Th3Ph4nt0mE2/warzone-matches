package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.Teams;

public interface TeamsRepository extends JpaRepository<Teams, Integer>{

}
