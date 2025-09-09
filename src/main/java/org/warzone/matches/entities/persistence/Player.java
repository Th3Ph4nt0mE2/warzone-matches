package org.warzone.matches.entities.persistence;

import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "PLAYERS", schema = "WARZONE_MATCHES")
public class Player {

	@Id
	@Column(name = "ID_PLAYERS")
	private int idPlayers;
	
	@Column(name = "NAME")
	private String name;
	
	@Column(name = "NICKNAME")
	private String nickname;
	
	@Column(name = "ROLE")
	private String role;
	
    @ManyToMany(mappedBy = "players")
    private List<Teams> teams;

	public int getIdPlayers() {
		return idPlayers;
	}
	
	public void setIdPlayers(int idPlayers) {
		this.idPlayers = idPlayers;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getNickname() {
		return nickname;
	}
	
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	
	public String getRole() {
		return role;
	}
	
	public void setRole(String role) {
		this.role = role;
	}

	public List<Teams> getTeams() {
		return teams;
	}

	public void setTeams(List<Teams> teams) {
		this.teams = teams;
	}
}
