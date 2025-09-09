package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.PlayerMatchStats;

public interface PlayerMatchStatsRepository extends JpaRepository<PlayerMatchStats, Integer>{

}
