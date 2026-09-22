package com.jobfins.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * NotificationController provides role-based notification streams.
 * (Path: /api/notifications).
 */
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final List<Map<String, Object>> seekerNotifications = List.of(
            Map.of(
                    "id", 101,
                    "title", "Interview Invitation Scheduled",
                    "message", "Google Cloud invited you for a Technical Round on Thursday at 3:00 PM.",
                    "time", "15 mins ago",
                    "type", "interview",
                    "icon", "bi-calendar-check",
                    "read", false
            ),
            Map.of(
                    "id", 102,
                    "title", "Application Shortlisted",
                    "message", "TechCorp reviewed your profile for Senior Java Engineer and moved you forward.",
                    "time", "1 hour ago",
                    "type", "status",
                    "icon", "bi-patch-check-fill",
                    "read", false
            ),
            Map.of(
                    "id", 103,
                    "title", "Matching Job Opportunity",
                    "message", "Amazon posted 'Backend Engineer (Spring Boot & AWS)' matching your skill profile.",
                    "time", "4 hours ago",
                    "type", "application",
                    "icon", "bi-briefcase-fill",
                    "read", true
            )
    );

    private final List<Map<String, Object>> recruiterNotifications = List.of(
            Map.of(
                    "id", 1,
                    "title", "New Application Received",
                    "message", "Sarah Jenkins applied for Senior Full Stack Java Developer.",
                    "time", "10 mins ago",
                    "type", "application",
                    "icon", "bi-person-badge",
                    "read", false
            ),
            Map.of(
                    "id", 2,
                    "title", "Candidate Shortlisted",
                    "message", "Rahul Sharma was moved to Technical Screening Round.",
                    "time", "2 hours ago",
                    "type", "status",
                    "icon", "bi-check2-circle",
                    "read", false
            ),
            Map.of(
                    "id", 3,
                    "title", "Job Posting Performance",
                    "message", "Your job post for Cloud Architect received 42 new views today.",
                    "time", "5 hours ago",
                    "type", "info",
                    "icon", "bi-graph-up-arrow",
                    "read", true
            )
    );

    @GetMapping("/seeker")
    public ResponseEntity<List<Map<String, Object>>> getSeekerNotifications() {
        return ResponseEntity.ok(seekerNotifications);
    }

    @GetMapping("/recruiter")
    public ResponseEntity<List<Map<String, Object>>> getRecruiterNotifications() {
        return ResponseEntity.ok(recruiterNotifications);
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllNotifications() {
        return ResponseEntity.ok(Map.of(
                "seekerAlerts", seekerNotifications,
                "recruiterAlerts", recruiterNotifications,
                "serverStatus", "LIVE_NOTIFICATION_STREAM_CONNECTED"
        ));
    }
}
