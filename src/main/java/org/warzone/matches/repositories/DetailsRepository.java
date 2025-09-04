package org.warzone.matches.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.warzone.matches.entities.persistence.Details;

public interface DetailsRepository extends JpaRepository<Details, Integer>{

}
