package org.warzone.matches.dto;

import java.util.List;

public class TeamSummaryDTO {

    private int teamId;
    private String teamName;
    private long totalKills;
    private List<String> players;

    public TeamSummaryDTO(int teamId, String teamName, long totalKills, List<String> players) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.totalKills = totalKills;
        this.players = players;
    }

    // Getters and Setters
    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public long getTotalKills() {
        return totalKills;
    }

    public void setTotalKills(long totalKills) {
        this.totalKills = totalKills;
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
