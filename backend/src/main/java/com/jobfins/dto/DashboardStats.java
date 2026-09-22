package com.jobfins.dto;

/**
 * DashboardStats DTO matching Sample Output - 1.png exactly.
 * (Experiment 4: DashboardStats DTO class).
 */
public class DashboardStats {

    private int totalAccounts = 120;
    private String totalDeposits = "18.45 L";
    private int activeLoans = 28;
    private int pendingKyc = 6;

    // Additional mini-project job metrics
    private long totalJobs;
    private long totalSeekers;
    private long totalRecruiters;
    private long totalApplications;

    public DashboardStats() {
    }

    public DashboardStats(int totalAccounts, String totalDeposits, int activeLoans, int pendingKyc) {
        this.totalAccounts = totalAccounts;
        this.totalDeposits = totalDeposits;
        this.activeLoans = activeLoans;
        this.pendingKyc = pendingKyc;
    }

    public DashboardStats(int totalAccounts, String totalDeposits, int activeLoans, int pendingKyc,
                          long totalJobs, long totalSeekers, long totalRecruiters, long totalApplications) {
        this.totalAccounts = totalAccounts;
        this.totalDeposits = totalDeposits;
        this.activeLoans = activeLoans;
        this.pendingKyc = pendingKyc;
        this.totalJobs = totalJobs;
        this.totalSeekers = totalSeekers;
        this.totalRecruiters = totalRecruiters;
        this.totalApplications = totalApplications;
    }

    public int getTotalAccounts() {
        return totalAccounts;
    }

    public void setTotalAccounts(int totalAccounts) {
        this.totalAccounts = totalAccounts;
    }

    public String getTotalDeposits() {
        return totalDeposits;
    }

    public void setTotalDeposits(String totalDeposits) {
        this.totalDeposits = totalDeposits;
    }

    public int getActiveLoans() {
        return activeLoans;
    }

    public void setActiveLoans(int activeLoans) {
        this.activeLoans = activeLoans;
    }

    public int getPendingKyc() {
        return pendingKyc;
    }

    public void setPendingKyc(int pendingKyc) {
        this.pendingKyc = pendingKyc;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalSeekers() {
        return totalSeekers;
    }

    public void setTotalSeekers(long totalSeekers) {
        this.totalSeekers = totalSeekers;
    }

    public long getTotalRecruiters() {
        return totalRecruiters;
    }

    public void setTotalRecruiters(long totalRecruiters) {
        this.totalRecruiters = totalRecruiters;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }
}
