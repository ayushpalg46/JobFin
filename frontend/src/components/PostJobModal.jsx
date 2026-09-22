import React, { useState } from 'react';

export default function PostJobModal({ isOpen, onClose, onJobCreated, user, onOpenLogin }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(user?.companyName || '');
  const [location, setLocation] = useState('Mumbai, Maharashtra');
  const [jobType, setJobType] = useState('Full-time');
  const [salary, setSalary] = useState('₹12,00,000 - ₹18,00,000 / yr');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('1. Bachelor’s degree in CS/IT/Finance\n2. Relevant industry experience\n3. Strong communication skills');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'ROLE_RECRUITER') {
      setError('Please log in as a Recruiter to post a job.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onJobCreated({
        title,
        company: company || user.companyName,
        location,
        jobType,
        salary,
        description,
        requirements,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(10,25,47,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark">
              <i className="bi bi-briefcase-fill me-2 text-primary"></i> Post a New Job Listing
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {!user || user.role !== 'ROLE_RECRUITER' ? (
              <div className="text-center py-4">
                <i className="bi bi-person-lock text-warning display-4 mb-3 d-block"></i>
                <h6 className="fw-bold text-dark">Recruiter Access Required</h6>
                <p className="text-muted small">You need to be logged in with a Recruiter account to post job vacancies.</p>
                <button className="btn btn-cobalt btn-sm px-4" onClick={() => { onClose(); onOpenLogin(); }}>
                  Sign In as Recruiter (recruiter@jobfins.com)
                </button>
              </div>
            ) : (
              <>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                {success && <div className="alert alert-success py-2 small">Job listing posted successfully to MySQL database!</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Job Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior Java Full Stack Developer"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Company Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. FinTech Global"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Location</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Mumbai, Maharashtra or Remote"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Job Type</label>
                      <select
                        className="form-select form-select-sm"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Internship">Internship</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label small fw-bold">Salary / Compensation</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="e.g. ₹12,00,000 - ₹18,00,000 / yr"
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label small fw-bold">Job Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe key responsibilities and goals..."
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label small fw-bold">Requirements & Tech Stack</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="3"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="List skills and technologies..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="btn btn-cobalt w-100 py-2 fw-bold" disabled={loading}>
                      {loading ? 'Publishing to MySQL...' : 'Publish Job Listing'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
