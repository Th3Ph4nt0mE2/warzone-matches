package org.warzone.matches.entities.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PLAYER_MATCH_STATS", schema = "WARZONE_MATCHES")
public class PlayerMatchStats {

	@Id
	@Column(name = "ID_DETAILS")
	private int idDetails;
	
	@Column(name = "ID_MATCHES")
	private int idMatches;
	
	@Column(name = "ID_PLAYER")
	private int idPlayer;
	
	@Column(name = "KILLS")
	private int kills;

	public int getIdDetails() {
		return idDetails;
	}

	public void setIdDetails(int idDetails) {
		this.idDetails = idDetails;
	}

	public int getIdMatches() {
		return idMatches;
	}

	public void setIdMatches(int idMatches) {
		this.idMatches = idMatches;
	}

	public int getIdPlayer() {
		return idPlayer;
	}

	public void setIdPlayer(int idPlayer) {
		this.idPlayer = idPlayer;
	}

	public int getKills() {
		return kills;
	}

	public void setKills(int kills) {
		this.kills = kills;
	}
}
