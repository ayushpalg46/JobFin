package com.jobfins.service;

import com.jobfins.dto.DashboardStats;
import com.jobfins.model.Role;
import com.jobfins.repository.ApplicationRepository;
import com.jobfins.repository.JobRepository;
import com.jobfins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * DashboardService computes portal summary metrics.
 * (Experiment 4: Dashboard statistics logic).
 */
@Service
public class DashboardService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    /**
     * Compute platform-wide summary statistics.
     */
    public DashboardStats getStats() {
        long totalJobs = jobRepository.count();
        long totalSeekers = userRepository.countByRole(Role.ROLE_SEEKER);
        long totalRecruiters = userRepository.countByRole(Role.ROLE_RECRUITER);
        long totalApplications = applicationRepository.count();

        return new DashboardStats(
                120,
                "18.45 L",
                28,
                6,
                totalJobs,
                totalSeekers,
                totalRecruiters,
                totalApplications
        );
    }
}
