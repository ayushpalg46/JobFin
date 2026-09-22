package com.jobfins.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * CompanyController provides verified hiring partner directory endpoints.
 * (Path: /api/companies).
 */
@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*")
public class CompanyController {

    private final List<Map<String, Object>> companies = List.of(
            Map.of(
                    "id", 1,
                    "name", "TechCorp Innovations",
                    "industry", "Enterprise Software & Cloud",
                    "headquarters", "Bangalore, India",
                    "openPositions", 14,
                    "rating", 4.8,
                    "website", "https://techcorp-innovations.com",
                    "verified", true
            ),
            Map.of(
                    "id", 2,
                    "name", "FinPay Solutions",
                    "industry", "FinTech & Banking Infrastructure",
                    "headquarters", "Mumbai, India",
                    "openPositions", 9,
                    "rating", 4.7,
                    "website", "https://finpay-solutions.com",
                    "verified", true
            ),
            Map.of(
                    "id", 3,
                    "name", "CloudScale Technologies",
                    "industry", "DevOps & Cloud Native Systems",
                    "headquarters", "Hyderabad / Remote",
                    "openPositions", 11,
                    "rating", 4.9,
                    "website", "https://cloudscale.io",
                    "verified", true
            ),
            Map.of(
                    "id", 4,
                    "name", "JobFins Labs",
                    "industry", "AI & Next-Gen Recruitment Platforms",
                    "headquarters", "Pune / Remote",
                    "openPositions", 6,
                    "rating", 5.0,
                    "website", "https://jobfins.com",
                    "verified", true
            )
    );

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCompanies() {
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Map<String, Object>>> getFeaturedCompanies() {
        return ResponseEntity.ok(companies.subList(0, 2));
    }

    @GetMapping("/locations")
    public ResponseEntity<List<Map<String, Object>>> getCompanyLocations() {
        return ResponseEntity.ok(List.of(
                Map.of("city", "Bangalore", "activeJobs", 42, "avgSalary", "₹16.5 LPA"),
                Map.of("city", "Mumbai", "activeJobs", 28, "avgSalary", "₹15.2 LPA"),
                Map.of("city", "Pune", "activeJobs", 19, "avgSalary", "₹12.8 LPA"),
                Map.of("city", "Hyderabad", "activeJobs", 24, "avgSalary", "₹14.0 LPA"),
                Map.of("city", "Remote", "activeJobs", 55, "avgSalary", "₹18.0 LPA")
        ));
    }
}
