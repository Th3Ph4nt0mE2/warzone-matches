package org.warzone.matches.entities.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TEAMS", schema = "WARZONE_MATCHES")
public class Teams {

	@Id
	@Column(name = "ID_TEAMS")
	private int idTeams;
	
	@Column(name = "NAME")
	private String name;
	
	public int getIdTeams() {
		return idTeams;
	}
	
	public void setIdTeams(int idTeams) {
		this.idTeams = idTeams;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
}
