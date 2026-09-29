import React from 'react';

export default function JobCard({ job, onSelectJob, onApplyJob }) {
  const getBadgeClass = (type) => {
    switch (type) {
      case 'Full-time': return 'badge-fulltime';
      case 'Remote': return 'badge-remote';
      case 'Internship': return 'badge-intern';
      default: return 'bg-light text-dark';
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Competitive Salary';
    return salary.replace(/\?(\s*\d)/g, '₹$1');
  };

  return (
    <div className="col-md-6 col-lg-6">
      <div className="job-card">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h3 className="h5 mb-1 text-dark cursor-pointer" onClick={() => onSelectJob(job)}>
                {job.title}
              </h3>
              <div className="text-primary fw-semibold">
                <i className="bi bi-building me-1"></i> {job.company}
              </div>
            </div>
            <span className={`job-badge ${getBadgeClass(job.jobType)}`}>
              {job.jobType}
            </span>
          </div>

          <p className="text-muted small my-2" style={{ minHeight: '38px' }}>
            {job.description?.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
          </p>

          {job.requirements && (
            <ul className="mb-2 ps-3 text-muted" style={{ fontSize: '0.81rem', lineHeight: '1.45' }}>
              {job.requirements.split('\n').filter(r => r.trim()).slice(0, 3).map((req, idx) => (
                <li key={idx} className="mb-1 text-truncate" title={req.replace(/^[0-9.]+\s*/, '').trim()}>
                  {req.replace(/^[0-9.]+\s*/, '').trim()}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 mt-2 border-top">
          <div>
            <small className="text-muted d-block">
              <i className="bi bi-geo-alt me-1"></i> {job.location}
            </small>
            <strong className="text-success">{formatSalary(job.salary)}</strong>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-custom btn-sm" onClick={() => onSelectJob(job)}>
              Details
            </button>
            <button className="btn btn-cobalt btn-sm" onClick={() => onApplyJob(job)}>
              <i className="bi bi-send me-1"></i> Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
