package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.Players;

public interface PlayersRepository extends JpaRepository<Players, Integer>{

}
