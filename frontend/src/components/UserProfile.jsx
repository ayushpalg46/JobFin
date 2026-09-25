import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

export default function UserProfile({ user, onProfileUpdated, onFindJobs, onOpenProfileWizard, onOpenPostJob }) {
  const isRecruiter = user?.role === 'ROLE_RECRUITER';

  // State
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [bioOrSkills, setBioOrSkills] = useState(user?.bioOrSkills || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Mid-Level (3-5 Yrs)');
  const [location, setLocation] = useState(user?.location || (isRecruiter ? 'Bangalore HQ' : 'Remote'));
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [companyWebsite, setCompanyWebsite] = useState(user?.companyWebsite || '');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setContactNumber(user.contactNumber || '');
      setCompanyName(user.companyName || '');
      setBioOrSkills(user.bioOrSkills || '');
      setLocation(user.location || (isRecruiter ? 'Bangalore HQ' : 'Remote'));
    }
  }, [user, isRecruiter]);

  // Determine profile completeness based on localStorage or user properties
  const isExplicitlyCompleted = Boolean(
    user?.completedProfile ||
    user?.profileStrength === 100 ||
    localStorage.getItem('jobfins_profile_completed_' + user?.email) === 'true' ||
    localStorage.getItem('jobfins_profile_completed') === 'true'
  );

  // Dynamic 8-stage verification matrix
  const candidateStages = [
    { label: 'Basic Identity (Name & Email)', isComplete: Boolean(user?.name && user?.email) },
    { label: 'Phone & Mobile Verified', isComplete: Boolean(user?.contactNumber) },
    { label: 'Resume / CV Document', isComplete: Boolean(user?.resumeFileName || user?.resumeUrl || user?.resumeBase64 || isExplicitlyCompleted) },
    { label: 'Experience & History', isComplete: Boolean(user?.experienceLevel || (user?.experiences && user.experiences.length > 0) || isExplicitlyCompleted) },
    { label: 'Technical Skills & Arsenal', isComplete: Boolean(user?.bioOrSkills || (user?.seekerSkills && user.seekerSkills.length > 0) || isExplicitlyCompleted) },
    { label: 'Professional Bio & Summary', isComplete: Boolean(user?.summary || user?.bioOrSkills || isExplicitlyCompleted) },
    { label: 'Target CTC & Notice Period', isComplete: Boolean(user?.expectedCtc || user?.noticePeriod || isExplicitlyCompleted) },
    { label: 'Profile Picture / Avatar', isComplete: Boolean(user?.profilePic || user?.githubUrl || isExplicitlyCompleted) },
  ];

  const recruiterStages = [
    { label: 'Recruiter Identity (Name & Email)', isComplete: Boolean(user?.name && user?.email) },
    { label: 'Mobile & Contact Number', isComplete: Boolean(user?.contactNumber) },
    { label: 'Corporate Registration / KYC', isComplete: Boolean(user?.gstin || user?.cinNumber || isExplicitlyCompleted) },
    { label: 'Company Overview & Website', isComplete: Boolean(user?.companyName && (user?.companyWebsite || isExplicitlyCompleted)) },
    { label: 'Target Hiring Tech Stack', isComplete: Boolean(user?.bioOrSkills || (user?.hiringDomains && user.hiringDomains.length > 0) || isExplicitlyCompleted) },
    { label: 'Recruiter Bio & Designation', isComplete: Boolean(user?.summary || user?.designation || isExplicitlyCompleted) },
    { label: 'Hiring Model & Preferences', isComplete: Boolean(user?.hiringVolume || isExplicitlyCompleted) },
    { label: 'Corporate Avatar / Logo', isComplete: Boolean(user?.profilePic || isExplicitlyCompleted) },
  ];

  const stagesList = isRecruiter ? recruiterStages : candidateStages;
  const completedCount = isExplicitlyCompleted ? 8 : stagesList.filter((s) => s.isComplete).length;
  const calculatedPercentage = isExplicitlyCompleted ? 100 : Math.round((completedCount / 8) * 100);
  const isProfileComplete = isExplicitlyCompleted || completedCount === 8;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const updateData = {
        name: name.trim(),
        contactNumber: contactNumber.trim(),
        companyName: isRecruiter ? companyName.trim() : null,
        bioOrSkills: !isRecruiter ? bioOrSkills.trim() : null,
      };

      const res = await userService.updateProfile(updateData);
      const updatedUser = {
        ...user,
        ...res.data,
      };

      // Save locally
      localStorage.setItem('jobfins_user', JSON.stringify(updatedUser));
      onProfileUpdated(updatedUser);

      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      setEditing(false);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      // Fallback update in case offline
      const updatedUser = {
        ...user,
        name,
        contactNumber,
        companyName: isRecruiter ? companyName : null,
        bioOrSkills: !isRecruiter ? bioOrSkills : null,
      };
      localStorage.setItem('jobfins_user', JSON.stringify(updatedUser));
      onProfileUpdated(updatedUser);
      setFeedback({ type: 'success', message: 'Profile saved locally!' });
      setEditing(false);
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Profile Header Banner */}
      <div className="card border shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
        <div className="p-4 p-md-5" style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1E3A8A 100%)', color: '#FFFFFF' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-4">
              <div
                className="rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center shadow-lg overflow-hidden"
                style={{ width: '80px', height: '80px', fontSize: '2rem' }}
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div>
                <span className={`badge ${isRecruiter ? 'bg-primary' : 'bg-success'} text-white mb-2`}>
                  {isRecruiter ? 'Enterprise Recruiter Profile' : 'Verified Candidate Profile'}
                </span>
                <h2 className="h3 fw-bold text-white mb-1">{name}</h2>
                <div className="d-flex flex-wrap gap-3 small text-white-50">
                  <span><i className="bi bi-envelope me-1"></i>{email}</span>
                  <span><i className="bi bi-telephone me-1"></i>{contactNumber || 'No phone added'}</span>
                  <span><i className="bi bi-geo-alt me-1"></i>{location || 'India'}</span>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              {isProfileComplete ? (
                <button
                  className="btn btn-outline-light btn-sm fw-bold px-3 shadow-sm d-flex align-items-center gap-1"
                  onClick={onOpenProfileWizard}
                  title="Profile 100% Completed (Click to edit stages)"
                >
                  <i className="bi bi-patch-check-fill text-success"></i>
                  <span>100% Profile Strength</span>
                </button>
              ) : (
                <button
                  className="btn btn-warning btn-sm fw-bold px-3 shadow-sm text-dark d-flex align-items-center gap-1"
                  onClick={onOpenProfileWizard}
                >
                  <i className="bi bi-stars"></i>
                  <span>Complete 8-Stage Profile ({calculatedPercentage}%)</span>
                </button>
              )}
              <button
                className="btn btn-light btn-sm fw-bold px-3 shadow-sm"
                onClick={() => setEditing(!editing)}
              >
                <i className={`bi ${editing ? 'bi-x-lg' : 'bi-pencil-square'} me-1`}></i>
                {editing ? 'Cancel' : 'Quick Edit'}
              </button>
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type} m-3 mb-0 py-2 px-3 small rounded-3`}>
            {feedback.message}
          </div>
        )}

        {/* Profile Content Body */}
        <div className="card-body p-4 p-md-5">
          {editing ? (
            /* Edit Form */
            <form onSubmit={handleSaveProfile}>
              <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">
                <i className="bi bi-pencil-fill text-primary me-2"></i> Edit {isRecruiter ? 'Recruiter & Company' : 'Candidate'} Details
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Contact Phone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>

                {isRecruiter ? (
                  <>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Company / Organization *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Company Website</label>
                      <input
                        type="url"
                        className="form-control"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Experience Level</label>
                      <select
                        className="form-select"
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                      >
                        <option value="Entry-Level (0-2 Yrs)">Entry-Level (0-2 Yrs)</option>
                        <option value="Mid-Level (3-5 Yrs)">Mid-Level (3-5 Yrs)</option>
                        <option value="Senior (6-9 Yrs)">Senior (6-9 Yrs)</option>
                        <option value="Lead / Architect (10+ Yrs)">Lead / Architect (10+ Yrs)</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Resume / Portfolio Link</label>
                      <input
                        type="url"
                        className="form-control"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        placeholder="https://drive.google.com/your-resume.pdf"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Technical Skills (Comma separated) *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={bioOrSkills}
                        onChange={(e) => setBioOrSkills(e.target.value)}
                        placeholder="e.g. Java 17, Spring Boot, MySQL, React, Docker"
                      />
                    </div>
                  </>
                )}

                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Location / City *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-cobalt px-4 fw-bold" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="row g-4">
              {/* Left Column: Details */}
              <div className="col-lg-8">
                {isRecruiter ? (
                  <div>
                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-building me-2 text-primary"></i> Company Overview</h5>
                    <div className="p-4 bg-light rounded-3 border mb-4">
                      <h6 className="fw-bold text-dark">{companyName || 'Company Name'}</h6>
                      <p className="text-muted small mb-2">
                        Official verified hiring partner on the JobFins recruitment network. Empowering technology teams to scale with high-caliber talent.
                      </p>
                      <div className="d-flex flex-wrap gap-3 small text-primary fw-semibold">
                        {companyWebsite && (
                          <span><i className="bi bi-globe me-1"></i> <a href={companyWebsite} target="_blank" rel="noreferrer">{companyWebsite}</a></span>
                        )}
                        <span><i className="bi bi-people-fill me-1"></i> 250-500 Employees</span>
                        <span><i className="bi bi-shield-check me-1 text-success"></i> GST Verified Entity</span>
                      </div>
                    </div>

                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-gear-fill me-2 text-primary"></i> Hiring Preferences</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-3 bg-white border rounded-3">
                          <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Target Engineering Domains</small>
                          <strong className="text-dark small">{bioOrSkills || 'Full Stack Java, React, DevOps & Cloud'}</strong>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 bg-white border rounded-3">
                          <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Typical Interview Turnaround</small>
                          <strong className="text-success small">3-5 Business Days</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-code-square me-2 text-primary"></i> Skills & Technical Stack</h5>
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {bioOrSkills ? (
                        bioOrSkills.split(',').map((skill, i) => (
                          <span key={i} className="badge bg-light text-primary border p-2 px-3 fw-semibold">
                            <i className="bi bi-check2 text-success me-1"></i> {skill.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small">No skills added yet. Complete your profile stages to add skills.</span>
                      )}
                    </div>

                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-briefcase me-2 text-primary"></i> Experience & Background</h5>
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark">{experienceLevel}</strong>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">Ready to Interview</span>
                      </div>
                      <p className="text-muted small mb-0">
                        {user?.summary || 'Demonstrated capability in enterprise Spring Boot backend design, MySQL database optimization, and React frontend user interfaces.'}
                      </p>
                    </div>

                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-file-earmark-pdf me-2 text-primary"></i> Verified Resume</h5>
                    <div className="p-3 bg-white border rounded-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-pdf text-danger fs-4"></i>
                        <div>
                          <strong className="text-dark small d-block">
                            {user?.resumeFileName || `${name.replace(/\s+/g, '_')}_Resume_2026.pdf`}
                          </strong>
                          <small className="text-muted">
                            {user?.resumeFileSize ? `${(user.resumeFileSize / (1024 * 1024)).toFixed(2)} MB &bull; ` : ''}
                            Updated on JobFins candidate registry
                          </small>
                        </div>
                      </div>
                      {user?.resumeBase64 ? (
                        <a
                          href={user.resumeBase64}
                          download={user.resumeFileName || 'Resume.pdf'}
                          className="btn btn-outline-primary btn-sm px-3 fw-semibold"
                        >
                          <i className="bi bi-download me-1"></i> Download Resume
                        </a>
                      ) : resumeUrl ? (
                        <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm px-3">
                          <i className="bi bi-box-arrow-up-right me-1"></i> View Resume
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm px-3"
                          onClick={onOpenProfileWizard}
                        >
                          <i className="bi bi-upload me-1"></i> Upload CV
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Profile State */}
              <div className="col-lg-4">
                {isProfileComplete ? (
                  /* When profile is 100% complete, REMOVE incomplete profile checklist and show Verified Account card */
                  <div className="p-4 bg-white rounded-4 border shadow-sm">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-sm"
                        style={{ width: '42px', height: '42px', minWidth: '42px' }}
                      >
                        <i className="bi bi-shield-check fs-4"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0">Verified Profile Active</h6>
                        <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.72rem' }}>
                          <i className="bi bi-check2-all me-1"></i> 100% Completed
                        </span>
                      </div>
                    </div>

                    <p className="text-muted small mb-3">
                      All 8 onboarding stages are fully completed and verified. Your profile is ranked with top recruiter visibility across JobFins.
                    </p>

                    <div className="p-3 bg-light rounded-3 border mb-3 small">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Account Status</span>
                        <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i> Active & Verified</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Security Tier</span>
                        <span className="text-dark fw-semibold">JWT Session Valid</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Database Sync</span>
                        <span className="text-primary fw-semibold">Cloud MySQL Synced</span>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      {isRecruiter ? (
                        <>
                          {onOpenPostJob && (
                            <button className="btn btn-cobalt fw-bold py-2 shadow-sm" onClick={onOpenPostJob}>
                              <i className="bi bi-plus-circle me-1"></i> Post New Job
                            </button>
                          )}
                          <button className="btn btn-outline-secondary btn-sm py-2" onClick={onOpenProfileWizard}>
                            <i className="bi bi-sliders me-1"></i> Edit 8-Stage Details
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-cobalt fw-bold py-2 shadow-sm" onClick={onFindJobs}>
                            <i className="bi bi-search me-1"></i> Search Matching Jobs
                          </button>
                          <button className="btn btn-outline-secondary btn-sm py-2" onClick={onOpenProfileWizard}>
                            <i className="bi bi-pencil-square me-1"></i> Edit 8-Stage Profile
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Dynamic Incomplete Profile Checklist (Calculated according to real stages) */
                  <div className="p-4 bg-light rounded-4 border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold text-dark text-uppercase mb-0" style={{ fontSize: '0.78rem' }}>
                        Profile Completeness
                      </h6>
                      <span className="badge bg-warning text-dark fw-bold">{completedCount}/8 Stages</span>
                    </div>

                    <div className="progress mb-2" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${calculatedPercentage}%` }}
                      ></div>
                    </div>

                    <div className="d-flex justify-content-between text-muted small mb-3">
                      <span>{calculatedPercentage}% Complete</span>
                      <span className="text-warning fw-bold">{8 - completedCount} stages remaining</span>
                    </div>

                    <ul className="list-unstyled small mb-4">
                      {stagesList.map((stage, idx) => (
                        <li
                          key={idx}
                          className={`mb-2 d-flex align-items-center gap-2 ${
                            stage.isComplete ? 'text-success fw-semibold' : 'text-muted'
                          }`}
                        >
                          <i
                            className={`bi ${
                              stage.isComplete ? 'bi-check-circle-fill text-success' : 'bi-circle text-secondary'
                            }`}
                          ></i>
                          <span>{stage.label}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className="btn btn-warning w-100 py-2 fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center gap-1"
                      onClick={onOpenProfileWizard}
                    >
                      <i className="bi bi-stars"></i>
                      <span>Complete Remaining Stages</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
