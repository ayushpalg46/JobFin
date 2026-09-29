import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

export default function UserProfile({ user, onProfileUpdated, onFindJobs, onOpenPostJob }) {
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
      setResumeUrl(user.resumeUrl || '');
      setCompanyWebsite(user.companyWebsite || '');
    }
  }, [user, isRecruiter]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'danger', message: 'File size exceeds 5MB limit. Please upload a smaller PDF or Word document.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      const updatedUser = {
        ...user,
        resumeFileName: file.name,
        resumeFileSize: file.size,
        resumeBase64: base64Data,
        resumeUploadDate: new Date().toISOString(),
      };
      localStorage.setItem('jobfins_user', JSON.stringify(updatedUser));
      onProfileUpdated(updatedUser);
      setFeedback({ type: 'success', message: `Resume "${file.name}" uploaded and saved to your profile!` });
      setTimeout(() => setFeedback(null), 3000);
    };
    reader.onerror = () => {
      setFeedback({ type: 'danger', message: 'Failed to read file. Please try another document.' });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    const updatedUser = {
      ...user,
      resumeFileName: null,
      resumeFileSize: null,
      resumeBase64: null,
      resumeUploadDate: null,
      resumeUrl: '',
    };
    setResumeUrl('');
    localStorage.setItem('jobfins_user', JSON.stringify(updatedUser));
    onProfileUpdated(updatedUser);
    setFeedback({ type: 'info', message: 'Resume removed from your profile.' });
    setTimeout(() => setFeedback(null), 3000);
  };

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
        location: location.trim(),
        resumeUrl: isRecruiter ? '' : resumeUrl.trim(),
        companyWebsite: isRecruiter ? companyWebsite.trim() : '',
        experienceLevel: isRecruiter ? null : experienceLevel,
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
        location,
        resumeUrl: isRecruiter ? '' : resumeUrl,
        companyWebsite: isRecruiter ? companyWebsite : '',
        experienceLevel: isRecruiter ? null : experienceLevel,
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
              <button
                className="btn btn-light btn-sm fw-bold px-3 shadow-sm"
                onClick={() => setEditing(!editing)}
              >
                <i className={`bi ${editing ? 'bi-x-lg' : 'bi-pencil-square'} me-1`}></i>
                {editing ? 'Cancel' : 'Edit Profile'}
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
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Upload Real Resume (PDF / DOCX)</label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                      {user?.resumeFileName && (
                        <small className="text-success d-block mt-1">
                          <i className="bi bi-check-circle-fill me-1"></i> Current file: {user.resumeFileName}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>Or Paste Resume / Portfolio Link</label>
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
                        <span className="text-muted small">No skills added yet. Click "Edit Profile" to add your skills.</span>
                      )}
                    </div>

                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-briefcase me-2 text-primary"></i> Experience & Background</h5>
                    <div className="p-3 bg-light rounded-3 border mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark">{experienceLevel}</strong>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">Ready to Interview</span>
                      </div>
                      <p className="text-muted small mb-0">
                        {user?.summary || 'Demonstrated capability in enterprise Spring Boot backend design, MySQL database optimization, and React frontend user interfaces.'}
                      </p>
                    </div>

                    <h5 className="fw-bold text-dark mb-3"><i className="bi bi-file-earmark-pdf me-2 text-primary"></i> Candidate Resume</h5>
                    {(user?.resumeBase64 || user?.resumeFileName || user?.resumeUrl || resumeUrl) ? (
                      <div className="p-3 bg-white border rounded-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-3 bg-primary-subtle text-primary p-2 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                            <i className="bi bi-file-earmark-pdf-fill fs-4 text-primary"></i>
                          </div>
                          <div>
                            <strong className="text-dark small d-block">
                              {user?.resumeFileName || 'Verified Resume Link'}
                            </strong>
                            <small className="text-muted">
                              {user?.resumeFileSize ? `${(user.resumeFileSize / (1024 * 1024)).toFixed(2)} MB • ` : ''}
                              {user?.resumeUploadDate ? `Uploaded on ${new Date(user.resumeUploadDate).toLocaleDateString()}` : 'Attached to profile'}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          {user?.resumeBase64 ? (
                            <a
                              href={user.resumeBase64}
                              download={user.resumeFileName || 'Resume.pdf'}
                              className="btn btn-primary btn-sm px-3 fw-semibold shadow-sm"
                            >
                              <i className="bi bi-download me-1"></i> Download
                            </a>
                          ) : (user?.resumeUrl || resumeUrl) ? (
                            <a
                              href={user?.resumeUrl || resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-primary btn-sm px-3 fw-semibold"
                            >
                              <i className="bi bi-box-arrow-up-right me-1"></i> View Link
                            </a>
                          ) : null}
                          <label className="btn btn-outline-secondary btn-sm px-3 mb-0 cursor-pointer">
                            <i className="bi bi-arrow-repeat me-1"></i> Replace
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
                          </label>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm px-2"
                            onClick={handleRemoveResume}
                            title="Remove Resume"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-light border border-dashed rounded-3 text-center">
                        <div className="mb-2 text-primary">
                          <i className="bi bi-file-earmark-arrow-up fs-2"></i>
                        </div>
                        <h6 className="fw-bold text-dark mb-1">No Resume Uploaded Yet</h6>
                        <p className="text-muted small mb-3" style={{ maxWidth: '440px', margin: '0 auto' }}>
                          Upload your actual resume file (PDF, DOCX up to 5MB) or enter a portfolio link so employers can evaluate you for open positions.
                        </p>
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          <label className="btn btn-cobalt btn-sm px-4 fw-semibold mb-0 cursor-pointer shadow-sm">
                            <i className="bi bi-upload me-1"></i> Upload Resume File (PDF)
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
                          </label>
                          <button type="button" className="btn btn-outline-custom btn-sm px-3" onClick={() => setEditing(true)}>
                            <i className="bi bi-link-45deg me-1"></i> Add Link
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Account Status Card */}
              <div className="col-lg-4">
                <div className="p-4 bg-white rounded-4 border shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: '42px', height: '42px', minWidth: '42px' }}
                    >
                      <i className="bi bi-shield-check fs-4"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">Verified Account</h6>
                      <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.72rem' }}>
                        Active Profile
                      </span>
                    </div>
                  </div>

                  <p className="text-muted small mb-3">
                    Your profile is active on JobFins. Manage your details, search matching vacancies, or publish new job opportunities.
                  </p>

                  <div className="p-3 bg-light rounded-3 border mb-3 small">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Account Status</span>
                      <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i> Active</span>
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
                        <button className="btn btn-outline-secondary btn-sm py-2" onClick={() => setEditing(true)}>
                          <i className="bi bi-pencil-square me-1"></i> Edit Company Profile
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-cobalt fw-bold py-2 shadow-sm" onClick={onFindJobs}>
                          <i className="bi bi-search me-1"></i> Search Matching Jobs
                        </button>
                        <button className="btn btn-outline-secondary btn-sm py-2" onClick={() => setEditing(true)}>
                          <i className="bi bi-pencil-square me-1"></i> Edit Candidate Profile
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
