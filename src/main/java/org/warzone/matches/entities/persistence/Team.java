package org.warzone.matches.entities.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TEAM", schema = "WARZONE_MATCHES")
public class Team {

	@Id
	@Column(name = "ID_TEAMS")
	private int idTeams;
	
	@Column(name = "ID_TEAM")
	private int idTeam;
	
	@Column(name = "ID_PLAYERS")
	private int idPlayers;
	
	public int getIdTeams() {
		return idTeams;
	}
	
	public void setIdTeams(int idTeams) {
		this.idTeams = idTeams;
	}
	
	public int getIdTeam() {
		return idTeam;
	}

	public void setIdTeam(int idTeam) {
		this.idTeam = idTeam;
	}

	public int getIdPlayers() {
		return idPlayers;
	}

	public void setIdPlayers(int idPlayers) {
		this.idPlayers = idPlayers;
	}
}
