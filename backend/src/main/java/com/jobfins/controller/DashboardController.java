package com.jobfins.controller;

import com.jobfins.dto.DashboardStats;
import com.jobfins.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * DashboardController provides portal analytics and summary stats.
 * (Experiment 4: DashboardController /api/dashboard/stats).
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Get platform summary statistics.
     * GET /api/dashboard/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = dashboardService.getStats();
        return ResponseEntity.ok(stats);
    }
}
