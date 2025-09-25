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
@Table(name = "MATCHES", schema = "WARZONE_MATCHES")
public class Matches {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID_MATCHES")
	private int idMatches;
	
	@ManyToOne
	@JoinColumn(name = "ID_TOURNAMENT")
	private Tournament tournament;
	
	@Column(name = "MATCH")
	private int match;
	
	@ManyToOne
	@JoinColumn(name = "ID_TEAMS")
	private Teams teams;
	
	@Column(name = "TOP")
	private int top;
	
	@Column(name = "TOTAL")
	private double total;
	
	public int getIdMatches() {
		return idMatches;
	}
	
	public void setIdMatches(int idMatches) {
		this.idMatches = idMatches;
	}
	
	public Tournament getTournament() {
		return tournament;
	}
	
	public void setTournament(Tournament tournament) {
		this.tournament = tournament;
	}
	
	public int getMatch() {
		return match;
	}
	
	public void setMatch(int match) {
		this.match = match;
	}
	
	public Teams getTeams() {
		return teams;
	}

	public void setTeams(Teams teams) {
		this.teams = teams;
	}

	public int getTop() {
		return top;
	}
	
	public void setTop(int top) {
		this.top = top;
	}
	
	public double getTotal() {
		return total;
	}
	
	public void setTotal(double total) {
		this.total = total;
	}
}
