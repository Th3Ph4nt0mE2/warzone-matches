package org.warzone.matches.entities.persistence;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "TEAMS")
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

    @OneToMany(mappedBy = "mainTeam")
    @JsonManagedReference
    private List<Player> mainRoster;

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

	public byte[] getLogo() {
		return logo;
	}

	public void setLogo(byte[] logo) {
		this.logo = logo;
	}

    public List<Player> getMainRoster() {
        return mainRoster;
    }

    public void setMainRoster(List<Player> mainRoster) {
        this.mainRoster = mainRoster;
    }
}
