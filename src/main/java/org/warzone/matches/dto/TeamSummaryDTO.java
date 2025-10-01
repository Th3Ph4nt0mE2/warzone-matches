package org.warzone.matches.dto;

import java.util.List;

public class TeamSummaryDTO {

    private int teamId;
    private String teamName;
    private double totalPoints;
    private List<String> players;

    public TeamSummaryDTO(int teamId, String teamName, double totalPoints, List<String> players) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.totalPoints = totalPoints;
        this.players = players;
    }

    // Getters and Setters
    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public double getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(double totalPoints) {
        this.totalPoints = totalPoints;
    }

    public List<String> getPlayers() {
        return players;
    }

    public void setPlayers(List<String> players) {
        this.players = players;
    }

    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }
}
