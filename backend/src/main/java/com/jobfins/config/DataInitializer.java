package com.jobfins.config;

import com.jobfins.model.Application;
import com.jobfins.model.Job;
import com.jobfins.model.Role;
import com.jobfins.model.User;
import com.jobfins.repository.ApplicationRepository;
import com.jobfins.repository.JobRepository;
import com.jobfins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataInitializer seeds sample recruiters, seekers, jobs, and applications
 * into the database on first run.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Auto-correct any legacy question mark characters in job salaries from previous non-UTF8 sessions
        try {
            for (Job job : jobRepository.findAll()) {
                if (job.getSalary() != null && job.getSalary().contains("?")) {
                    job.setSalary(job.getSalary().replaceAll("\\?(\\s*\\d)", "₹$1"));
                    jobRepository.save(job);
                }
            }
        } catch (Exception ignored) {
        }
    }
}
