import React, { useState } from 'react';

export default function JobDetailsModal({ job, isOpen, onClose, onApplySubmit, user }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen || !job) return null;

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

    setSubmitting(true);
    setFeedback(null);
    try {
      await onApplySubmit(job.id, { coverLetter, resumeLink });
      setFeedback({ type: 'success', message: 'Application submitted successfully to MySQL database!' });
      setCoverLetter('');
      setResumeLink('');
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
                    <label className="form-label small fw-bold">Resume Attachment / Link *</label>
                    {user?.resumeFileName ? (
                      <div className="p-2 mb-2 bg-light border rounded d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark-pdf text-danger fs-5"></i>
                          <small className="fw-semibold text-dark">{user.resumeFileName}</small>
                        </div>
                        <span className="badge bg-success">Profile Resume</span>
                      </div>
                    ) : null}
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                      placeholder={user?.resumeFileName ? "Or provide alternative URL / portfolio..." : "Paste resume URL / portfolio..."}
                      required={!user?.resumeFileName}
                    />
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
