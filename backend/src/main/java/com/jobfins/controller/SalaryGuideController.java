package com.jobfins.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * SalaryGuideController provides market compensation benchmarks and salary telemetry.
 * (Path: /api/salary-guide).
 */
@RestController
@RequestMapping("/api/salary-guide")
@CrossOrigin(origins = "*")
public class SalaryGuideController {

    private final List<Map<String, Object>> salaryBenchmarks = List.of(
            Map.of(
                    "role", "Java Backend Developer",
                    "domain", "Software Engineering",
                    "entryLevel", "₹6.5 - ₹10 LPA",
                    "midLevel", "₹12 - ₹18 LPA",
                    "seniorLevel", "₹22 - ₹35 LPA",
                    "topSkills", List.of("Java 17+", "Spring Boot", "MySQL", "Microservices", "Docker"),
                    "marketDemand", "High (94% Hiring Index)"
            ),
            Map.of(
                    "role", "Frontend React Developer",
                    "domain", "UI/UX Engineering",
                    "entryLevel", "₹5.5 - ₹8.5 LPA",
                    "midLevel", "₹10 - ₹16 LPA",
                    "seniorLevel", "₹18 - ₹28 LPA",
                    "topSkills", List.of("React.js", "TypeScript", "Redux", "Bootstrap 5", "REST APIs"),
                    "marketDemand", "Very High (96% Hiring Index)"
            ),
            Map.of(
                    "role", "Cloud DevOps Engineer",
                    "domain", "Cloud Infrastructure",
                    "entryLevel", "₹7 - ₹11 LPA",
                    "midLevel", "₹14 - ₹22 LPA",
                    "seniorLevel", "₹25 - ₹42 LPA",
                    "topSkills", List.of("Docker", "Kubernetes", "AWS", "CI/CD Actions", "Linux"),
                    "marketDemand", "Exceptional (98% Hiring Index)"
            ),
            Map.of(
                    "role", "Fintech Quant & Data Analyst",
                    "domain", "Financial Engineering",
                    "entryLevel", "₹8 - ₹12 LPA",
                    "midLevel", "₹15 - ₹24 LPA",
                    "seniorLevel", "₹28 - ₹45 LPA",
                    "topSkills", List.of("SQL", "Python", "Algorithmic Models", "Risk Analytics", "Tableau"),
                    "marketDemand", "High (92% Hiring Index)"
            )
    );

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getSalaryBenchmarks() {
        return ResponseEntity.ok(salaryBenchmarks);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getAvailableRoles() {
        return ResponseEntity.ok(List.of(
                "Java Backend Developer",
                "Frontend React Developer",
                "Full Stack Engineer",
                "Cloud DevOps Engineer",
                "Fintech Quant & Data Analyst",
                "Engineering Lead / Architect"
        ));
    }

    @GetMapping("/tech-stack")
    public ResponseEntity<Map<String, String>> getAverageByTechStack() {
        return ResponseEntity.ok(Map.of(
                "Spring Boot + MySQL", "₹14.2 LPA Average",
                "React + TypeScript", "₹12.8 LPA Average",
                "Docker + Kubernetes + Cloud", "₹18.5 LPA Average",
                "Python + Financial Modeling", "₹16.0 LPA Average",
                "Full Stack Java + React", "₹17.4 LPA Average"
        ));
    }
}
