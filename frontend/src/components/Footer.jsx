import React from 'react';

export default function Footer({ onOpenLogin, onOpenRegister, onOpenPostJob }) {
  return (
    <footer>
      <div className="container text-center text-md-start">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center mb-3">
              <img src="/logo.svg" alt="JobFins Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            </div>
            <p className="small text-muted">
              JobFin is India's leading recruitment platform connecting verified employers with elite tech and finance talent.
            </p>
          </div>
          <div className="col-md-2 col-6">
            <h6 className="text-white fw-bold small text-uppercase mb-3">For Candidates</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Browse Jobs</a></li>
              <li className="mb-2"><a className="cursor-pointer" onClick={onOpenLogin}>Candidate Login</a></li>
              <li className="mb-2"><a className="cursor-pointer" onClick={onOpenRegister}>Create Account</a></li>
            </ul>
          </div>
          <div className="col-md-2 col-6">
            <h6 className="text-white fw-bold small text-uppercase mb-3">For Employers</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a className="cursor-pointer" onClick={onOpenPostJob}>Post a Job</a></li>
              <li className="mb-2"><a className="cursor-pointer" onClick={onOpenLogin}>Recruiter Login</a></li>
              <li className="mb-2"><a className="cursor-pointer" onClick={onOpenRegister}>Employer Register</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-white fw-bold small text-uppercase mb-3">Platform Highlights</h6>
            <p className="small text-muted mb-2">Enterprise-grade applicant tracking and intelligent talent discovery.</p>
            <div className="d-flex flex-wrap gap-1">
              <span className="badge bg-secondary text-white">Verified Employers</span>
              <span className="badge bg-secondary text-white">Real-Time ATS</span>
              <span className="badge bg-secondary text-white">Secure Profiles</span>
              <span className="badge bg-secondary text-white">Direct Messaging</span>
            </div>
          </div>
        </div>
        <div className="pt-3 border-top border-secondary text-center small text-muted">
          &copy; 2026 JobFins Recruitment Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
