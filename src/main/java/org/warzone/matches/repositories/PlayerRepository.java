package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.Player;

public interface PlayerRepository extends JpaRepository<Player, Integer> {

}
