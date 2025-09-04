package org.warzone.matches.entities.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PLAYERS", schema = "WARZONE_MATCHES")
public class Players {

	@Id
	@Column(name = "ID_PLAYERS")
	private int idPlayers;
	
	@Column(name = "NAME")
	private String name;
	
	@Column(name = "NICKNAME")
	private String nickname;
	
	@Column(name = "ROLE")
	private String role;
	
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
}
