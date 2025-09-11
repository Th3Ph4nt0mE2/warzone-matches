package org.warzone.matches.entities.persistence;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "TEAMS", schema = "WARZONE_MATCHES")
public class Teams {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID_TEAMS")
	private int idTeams;

	@Column(name = "NAME")
	private String name;

	@Lob
	@Column(name = "LOGO", columnDefinition="BLOB")
	private byte[] logo;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(
        name = "TEAM",
        joinColumns = @JoinColumn(name = "ID_TEAMS"),
        inverseJoinColumns = @JoinColumn(name = "ID_PLAYER")
    )
	private List<Player> players;

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

	public List<Player> getPlayers() {
		return players;
	}

	public void setPlayers(List<Player> players) {
		this.players = players;
	}

	public byte[] getLogo() {
		return logo;
	}

	public void setLogo(byte[] logo) {
		this.logo = logo;
	}
}
