package com.jobfins.repository;

import com.jobfins.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ApplicationRepository interface providing CRUD methods for job applications.
 * Extends JpaRepository<Application, Long> (Experiment 5).
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Find all applications submitted by a specific seeker
    List<Application> findBySeekerIdOrderByAppliedDateDesc(Long seekerId);

    // Find all applicants for a specific job post (for recruiter)
    List<Application> findByJobIdOrderByAppliedDateDesc(Long jobId);

    // Find all applications across all jobs belonging to a specific recruiter
    List<Application> findByJobRecruiterIdOrderByAppliedDateDesc(Long recruiterId);

    // Check if seeker has already applied to a job
    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);
}
