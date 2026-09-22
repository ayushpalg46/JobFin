package com.jobfins.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for Recruiter updating the status of an application (e.g. ACCEPTED, REJECTED, SHORTLISTED).
 */
public class StatusUpdateRequest {

    @NotBlank(message = "Status cannot be empty")
    private String status;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
