import React, { useState } from 'react';

export default function JobDetailsModal({ job, isOpen, onClose, onApplySubmit, user }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFileBase64, setAttachedFileBase64] = useState('');
  const [useProfileResume, setUseProfileResume] = useState(Boolean(user?.resumeFileName || user?.resumeBase64 || user?.resumeUrl));
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen || !job) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'danger', message: 'File size exceeds 5MB limit. Please upload a smaller document.' });
      return;
    }
    setAttachedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFileBase64(reader.result);
      setUseProfileResume(false);
      setFeedback(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setFeedback({ type: 'danger', message: 'Please sign in as a Job Seeker to apply for this position.' });
      return;
    }
    if (user.role !== 'ROLE_SEEKER') {
      setFeedback({ type: 'warning', message: 'Recruiters cannot apply for jobs. Please log in as a Job Seeker.' });
      return;
    }

    let finalResume = '';
    if (attachedFileBase64) {
      finalResume = attachedFileBase64;
    } else if (resumeLink.trim()) {
      finalResume = resumeLink.trim();
    } else if (useProfileResume && (user?.resumeBase64 || user?.resumeUrl || user?.resumeFileName)) {
      finalResume = user.resumeBase64 || user.resumeUrl || user.resumeFileName;
    }

    if (!finalResume) {
      setFeedback({ type: 'danger', message: 'Please upload a real resume file (PDF/DOCX) or provide a resume link.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      await onApplySubmit(job.id, { coverLetter, resumeLink: finalResume });
      setFeedback({ type: 'success', message: 'Application submitted successfully to employer!' });
      setCoverLetter('');
      setResumeLink('');
      setAttachedFile(null);
      setAttachedFileBase64('');
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1800);
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to submit application. You may have already applied!' });
    } finally {
      setSubmitting(false);
    }
  };

  const hasProfileResume = Boolean(user?.resumeFileName || user?.resumeBase64 || user?.resumeUrl);

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(10,25,47,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title fw-bold text-dark">{job.title}</h5>
              <div className="text-primary fw-semibold small">
                <i className="bi bi-building me-1"></i> {job.company} &bull; <i className="bi bi-geo-alt me-1"></i> {job.location}
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row g-4">
              <div className="col-md-7">
                <h6 className="fw-bold text-dark mb-2"><i className="bi bi-info-circle me-1 text-primary"></i> Job Overview</h6>
                <p className="text-muted small">{job.description}</p>

                <h6 className="fw-bold text-dark mt-4 mb-2"><i className="bi bi-check2-square me-1 text-success"></i> Requirements & Qualifications</h6>
                <div className="bg-light p-3 rounded border small text-muted">
                  <pre className="mb-0" style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{job.requirements || 'No specific requirements listed.'}</pre>
                </div>

                <div className="mt-3 d-flex gap-3 small text-muted">
                  <span><strong>Job Type:</strong> {job.jobType}</span>
                  <span><strong>Compensation:</strong> {job.salary || 'Competitive'}</span>
                </div>
              </div>

              <div className="col-md-5 border-start">
                <h6 className="fw-bold text-dark mb-3"><i className="bi bi-send me-1 text-primary"></i> Easy 1-Click Apply</h6>

                {feedback && (
                  <div className={`alert alert-${feedback.type} py-2 small`}>
                    {feedback.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Cover Letter / Application Note *</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Highlight your key technical skills and suitability for this role..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Resume Attachment *</label>
                    
                    {hasProfileResume && (
                      <div className="p-2 mb-2 bg-light border rounded d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark-pdf text-danger fs-5"></i>
                          <small className="fw-semibold text-dark text-truncate" style={{ maxWidth: '170px' }}>
                            {user.resumeFileName || user.resumeUrl || 'Profile Resume'}
                          </small>
                        </div>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          Saved in Profile
                        </span>
                      </div>
                    )}

                    <div className="mb-2">
                      <label className="form-label text-muted" style={{ fontSize: '0.75rem' }}>
                        {hasProfileResume ? 'Or attach an updated file for this application:' : 'Upload real resume file (PDF / DOCX):'}
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                      {attachedFile && (
                        <small className="text-primary d-block mt-1">
                          <i className="bi bi-file-earmark-check me-1"></i> Attached: {attachedFile.name} ({(attachedFile.size / 1024).toFixed(1)} KB)
                        </small>
                      )}
                    </div>

                    <div>
                      <label className="form-label text-muted" style={{ fontSize: '0.75rem' }}>Or paste resume URL / portfolio link:</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={resumeLink}
                        onChange={(e) => {
                          setResumeLink(e.target.value);
                          if (e.target.value) setUseProfileResume(false);
                        }}
                        placeholder="https://drive.google.com/your-resume.pdf"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-cobalt w-100 btn-sm py-2 fw-bold" disabled={submitting}>
                    {submitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
