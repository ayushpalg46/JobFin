package com.jobfins.dto;

/**
 * DTO for Seeker submitting a Job Application.
 */
public class ApplicationRequest {

    private String coverLetter;
    private String resumeLink;

    public ApplicationRequest() {
    }

    public ApplicationRequest(String coverLetter, String resumeLink) {
        this.coverLetter = coverLetter;
        this.resumeLink = resumeLink;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeLink() {
        return resumeLink;
    }

    public void setResumeLink(String resumeLink) {
        this.resumeLink = resumeLink;
    }
}
