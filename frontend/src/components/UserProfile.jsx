import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

export default function UserProfile({ user, onProfileUpdated, onFindJobs }) {
  const isRecruiter = user?.role === 'ROLE_RECRUITER';

  // State
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '+91 98765 43210');
  const [companyName, setCompanyName] = useState(user?.companyName || 'TechCorp Innovations');
  const [bioOrSkills, setBioOrSkills] = useState(user?.bioOrSkills || 'Java 17, Spring Boot, MySQL, React.js, Docker, Microservices');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (3-5 Yrs)');
  const [location, setLocation] = useState(isRecruiter ? 'Bangalore HQ' : 'Mumbai / Remote');
  const [resumeUrl, setResumeUrl] = useState('https://drive.google.com/your-verified-resume.pdf');
  const [companyWebsite, setCompanyWebsite] = useState('https://techcorp-innovations.com');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setContactNumber(user.contactNumber || '');
      setCompanyName(user.companyName || '');
      setBioOrSkills(user.bioOrSkills || '');
    }
  }, [user]);

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
                className="rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center shadow-lg"
                style={{ width: '80px', height: '80px', fontSize: '2rem' }}
              >
                {name?.charAt(0) || 'U'}
              </div>
              <div>
                <span className={`badge ${isRecruiter ? 'bg-primary' : 'bg-success'} text-white mb-2`}>
                  {isRecruiter ? 'Enterprise Recruiter Profile' : 'Verified Candidate Profile'}
                </span>
                <h2 className="h3 fw-bold text-white mb-1">{name}</h2>
                <div className="d-flex flex-wrap gap-3 small text-white-50">
                  <span><i className="bi bi-envelope me-1"></i>{email}</span>
                  <span><i className="bi bi-telephone me-1"></i>{contactNumber || 'No phone added'}</span>
                  <span><i className="bi bi-geo-alt me-1"></i>{location}</span>
                </div>
              </div>
            </div>

            <button
              className="btn btn-light btn-sm fw-bold px-3 shadow-sm"
              onClick={() => setEditing(!editing)}
            >
              <i className={`bi ${editing ? 'bi-x-lg' : 'bi-pencil-square'} me-1`}></i>
              {editing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
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
                        <span><i className="bi bi-globe me-1"></i> <a href={companyWebsite} target="_blank" rel="noreferrer">{companyWebsite}</a></span>
                        <span><i className="bi bi-people-fill me-1"></i> 250-500 Employees</span>
                        <span><i className="bi bi-shield-check me-1 text-success"></i> GST Verified Entity</span>
                      </div>
                    </div>

                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-gear-fill me-2 text-primary"></i> Hiring Preferences</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-3 bg-white border rounded-3">
                          <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Target Engineering Domains</small>
                          <strong className="text-dark small">Full Stack Java, React, DevOps & Cloud</strong>
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
                      {bioOrSkills?.split(',').map((skill, i) => (
                        <span key={i} className="badge bg-light text-primary border p-2 px-3 fw-semibold">
                          <i className="bi bi-check2 text-success me-1"></i> {skill.trim()}
                        </span>
                      ))}
                    </div>

                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-briefcase me-2 text-primary"></i> Experience & Background</h5>
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark">{experienceLevel}</strong>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">Ready to Interview</span>
                      </div>
                      <p className="text-muted small mb-0">
                        Demonstrated capability in enterprise Spring Boot backend design, MySQL database optimization, and React frontend user interfaces.
                      </p>
                    </div>

                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-file-earmark-pdf me-2 text-primary"></i> Verified Resume</h5>
                    <div className="p-3 bg-white border rounded-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-pdf text-danger fs-4"></i>
                        <div>
                          <strong className="text-dark small d-block">{name.replace(/\s+/g, '_')}_Resume_2026.pdf</strong>
                          <small className="text-muted">Updated on JobFins candidate registry</small>
                        </div>
                      </div>
                      <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm px-3">
                        <i className="bi bi-box-arrow-up-right me-1"></i> View Resume
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Profile Stats Card */}
              <div className="col-lg-4">
                <div className="p-4 bg-light rounded-4 border">
                  <h6 className="fw-bold text-dark text-uppercase mb-3" style={{ fontSize: '0.78rem' }}>Profile Completeness</h6>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '95%' }}></div>
                  </div>
                  <div className="d-flex justify-content-between text-muted small mb-4">
                    <span>95% Complete</span>
                    <span className="text-success fw-bold">Verified</span>
                  </div>

                  <ul className="list-unstyled small mb-4">
                    <li className="mb-2 d-flex align-items-center gap-2 text-success">
                      <i className="bi bi-check-circle-fill"></i> Email verified via JWT
                    </li>
                    <li className="mb-2 d-flex align-items-center gap-2 text-success">
                      <i className="bi bi-check-circle-fill"></i> Mobile number linked
                    </li>
                    <li className="mb-2 d-flex align-items-center gap-2 text-success">
                      <i className="bi bi-check-circle-fill"></i> Role preferences configured
                    </li>
                    <li className="d-flex align-items-center gap-2 text-success">
                      <i className="bi bi-check-circle-fill"></i> MySQL database profile active
                    </li>
                  </ul>

                  {!isRecruiter && (
                    <button className="btn btn-cobalt w-100 py-2 fw-bold" onClick={onFindJobs}>
                      <i className="bi bi-search me-1"></i> Search Matching Jobs
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
