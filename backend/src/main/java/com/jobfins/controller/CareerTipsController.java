package com.jobfins.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * CareerTipsController provides career guides and technical interview resources.
 * (Path: /api/career-tips).
 */
@RestController
@RequestMapping("/api/career-tips")
@CrossOrigin(origins = "*")
public class CareerTipsController {

    private final List<Map<String, Object>> tips = List.of(
            Map.of(
                    "id", 1,
                    "title", "Cracking the Spring Boot & Java 17 Technical Interview",
                    "category", "Technical Interview Prep",
                    "readTime", "5 min read",
                    "highlights", List.of(
                            "Understand Spring IoC & Dependency Injection life cycle",
                            "Deep dive into Transaction Management (@Transactional & ACID)",
                            "Optimize MySQL indexing and Hibernate N+1 query traps"
                    )
            ),
            Map.of(
                    "id", 2,
                    "title", "Building an ATS-Friendly Full Stack Resume in 2026",
                    "category", "Resume Optimization",
                    "readTime", "4 min read",
                    "highlights", List.of(
                            "Quantify achievements: 'Reduced API response times by 35%'",
                            "Highlight key frameworks: Java 17, Spring Boot, React, Docker",
                            "Add verified portfolio links to live demos and GitHub repos"
                    )
            ),
            Map.of(
                    "id", 3,
                    "title", "Mastering React 18: Hooks, Context & State Architecture",
                    "category", "Frontend Mastery",
                    "readTime", "6 min read",
                    "highlights", List.of(
                            "Effective state management without unnecessary re-renders",
                            "Axios request interceptors for automatic JWT Authorization header",
                            "Responsive design with modern CSS tokens and Dark Mode"
                    )
            )
    );

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCareerTips() {
        return ResponseEntity.ok(tips);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(List.of(
                "Technical Interview Prep",
                "Resume Optimization",
                "Frontend Mastery",
                "System Design & Microservices",
                "Salary Negotiation"
        ));
    }
}
