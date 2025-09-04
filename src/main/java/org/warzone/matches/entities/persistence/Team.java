package org.warzone.matches.entities.persistence;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "TEAMS", schema = "WARZONE_MATCHES")
public class Team {

	@Id
	@Column(name = "ID_TEAMS")
	private int idTeams;
	
	@Column(name = "NAME")
	private String name;
	
	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinTable(name = "TEAM_PLAYER",
               joinColumns = {
                       @JoinColumn(name = "team_id", referencedColumnName = "ID",
                               nullable = false, updatable = false)},
               inverseJoinColumns = {
                       @JoinColumn(name = "player_id", referencedColumnName = "ID",
                               nullable = false, updatable = false)})
    private Set<Player> players = new HashSet<>();
	
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
	
	public Set<Player> getPlayers() {
        return players;
    }

    public void setPlayers(Set<Player> players) {
        this.players = players;
    }
}
