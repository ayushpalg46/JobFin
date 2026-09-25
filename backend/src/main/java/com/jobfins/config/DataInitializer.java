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
        // Only seed data if database is empty
        if (userRepository.count() == 0) {
            System.out.println(">>> Seeding sample data for JobFins Job Portal...");

            // 1. Create Sample Recruiters
            User recruiter1 = new User(
                    "Sarah Jenkins",
                    "recruiter@jobfins.com",
                    passwordEncoder.encode("password123"),
                    Role.ROLE_RECRUITER,
                    "CloudTech Innovations",
                    "+91 9876543210",
                    "Senior Talent Acquisition Manager"
            );
            userRepository.save(recruiter1);

            User recruiter2 = new User(
                    "Amit Sharma",
                    "hr@techcorp.com",
                    passwordEncoder.encode("password123"),
                    Role.ROLE_RECRUITER,
                    "TechCorp Solutions",
                    "+91 9123456780",
                    "HR Lead - Technology Hiring"
            );
            userRepository.save(recruiter2);

            // 2. Create Sample Job Seekers
            User seeker1 = new User(
                    "Rohan Verma",
                    "seeker@jobfins.com",
                    passwordEncoder.encode("password123"),
                    Role.ROLE_SEEKER,
                    null,
                    "+91 9988776655",
                    "Java, Spring Boot, MySQL, React.js, REST APIs"
            );
            userRepository.save(seeker1);

            User seeker2 = new User(
                    "Priya Patel",
                    "priya@gmail.com",
                    passwordEncoder.encode("password123"),
                    Role.ROLE_SEEKER,
                    null,
                    "+91 9871234567",
                    "Data Analytics, Python, SQL, Cloud Architecture"
            );
            userRepository.save(seeker2);

            // 3. Create Sample Jobs
            Job job1 = new Job(
                    "Full Stack Java Developer",
                    "TechCorp Solutions",
                    "Mumbai, Maharashtra",
                    "Full-time",
                    "₹10,00,000 - ₹15,00,000 / yr",
                    "Looking for a motivated Java Developer experienced with Spring Boot, MySQL, and React frontend.",
                    "1. Strong proficiency in Java 17+ and Spring Boot\n2. Experience with REST APIs and MySQL\n3. Basic knowledge of React.js",
                    recruiter2
            );
            jobRepository.save(job1);

            Job job2 = new Job(
                    "Cloud DevOps Engineer",
                    "CloudTech Innovations",
                    "Remote",
                    "Full-time",
                    "₹12,00,000 - ₹18,00,000 / yr",
                    "Manage containerized deployments with Docker and Kubernetes, CI/CD pipelines, and cloud systems.",
                    "1. Degree in Computer Science / Engineering\n2. Experience with Docker, Kubernetes and Linux\n3. CI/CD pipeline automation",
                    recruiter1
            );
            jobRepository.save(job2);

            Job job3 = new Job(
                    "Frontend React Developer",
                    "TechCorp Solutions",
                    "Bangalore, Karnataka",
                    "Full-time",
                    "₹9,00,000 - ₹14,00,000 / yr",
                    "Develop modern responsive dashboards and interactive web applications using React and Bootstrap.",
                    "1. Proficiency in HTML5, CSS3, JavaScript ES6+\n2. React.js with Redux or Context API\n3. Integration with Spring Boot REST APIs",
                    recruiter2
            );
            jobRepository.save(job3);

            Job job4 = new Job(
                    "Junior Software Intern",
                    "CloudTech Innovations",
                    "Pune, Maharashtra",
                    "Internship",
                    "₹25,000 / month",
                    "Exciting internship opportunity for engineering students to learn Full Stack Java development.",
                    "1. Pursuing B.E / B.Tech in CS/IT\n2. Understanding of OOP concepts in Java\n3. Eager to learn Spring Boot and databases",
                    recruiter1
            );
            jobRepository.save(job4);

            // 4. Create Sample Application
            Application application1 = new Application(
                    job1,
                    seeker1,
                    "I have built several Full Stack Java & Spring Boot projects and would love to contribute to TechCorp Solutions.",
                    "https://github.com/rohan-verma/resume.pdf"
            );
            application1.setStatus("SHORTLISTED");
            applicationRepository.save(application1);

            System.out.println(">>> Sample data seeded successfully! Demo accounts ready: recruiter@jobfins.com / seeker@jobfins.com (password: password123)");
        }
    }
}
