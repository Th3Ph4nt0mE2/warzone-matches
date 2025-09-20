package org.warzone.matches.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.warzone.matches.entities.persistence.Teams;
import org.warzone.matches.repositories.TeamsRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TeamsService {

    @Autowired
    private TeamsRepository teamsRepository;


    public List<Teams> getAllTeams() {
        return teamsRepository.findAll();
    }

    public Optional<Teams> getTeamById(int id) {
        return teamsRepository.findById(id);
    }

    public Teams saveTeam(Teams team) {
        return teamsRepository.save(team);
    }

    public void deleteTeam(int id) {
        teamsRepository.deleteById(id);
    }

}
