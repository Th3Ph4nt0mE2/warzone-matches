package org.warzone.matches.entities.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PLAYER_MATCH_STATS", schema = "WARZONE_MATCHES")
public class PlayerMatchStats {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID_DETAILS")
	private int idDetails;
	
	@ManyToOne
	@JoinColumn(name = "ID_MATCHES")
	private Matches match;
	
	@ManyToOne
	@JoinColumn(name = "ID_PLAYER")
	private Player player;
	
	@Column(name = "KILLS")
	private int kills;

	public int getIdDetails() {
		return idDetails;
	}

	public void setIdDetails(int idDetails) {
		this.idDetails = idDetails;
	}

	public Matches getMatch() {
		return match;
	}

	public void setMatch(Matches match) {
		this.match = match;
	}

	public Player getPlayer() {
		return player;
	}

	public void setPlayer(Player player) {
		this.player = player;
	}

	public int getKills() {
		return kills;
	}

	public void setKills(int kills) {
		this.kills = kills;
	}
}
