import React, { useState } from 'react';

const mockCandidates = [
  {
    id: 1,
    name: 'Ayzen Vance',
    role: 'Senior Java Backend & Distributed Systems Lead',
    exp: '7.5 Yrs (Ex-QuantFunds, Stripe)',
    match: 98,
    location: 'Bengaluru / Mumbai (Hybrid)',
    expectedCtc: '₹32 - ₹38 LPA',
    notice: 'Immediate (<15 Days)',
    skills: ['Java 21', 'Spring Boot 3', 'Apache Kafka', 'Redis', 'Kubernetes', 'MySQL'],
    bio: 'Specializes in high-throughput transactional backends, microservice decomposition, and low-latency financial systems.',
  },
  {
    id: 2,
    name: 'Maya Chen',
    role: 'Staff Distributed Systems Architect',
    exp: '6.5 Yrs (Ex-Stripe, Amazon)',
    match: 96,
    location: 'Mumbai (BKC)',
    expectedCtc: '₹45 - ₹55 LPA',
    notice: '30 Days Notice',
    skills: ['Java', 'Go', 'Distributed DBs', 'Kafka', 'AWS EKS', 'Docker'],
    bio: 'Lead architect for scalable microservice platforms handling 100k+ TPS with 99.999% availability SLAs.',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Senior Cloud & DevOps SRE Engineer',
    exp: '5.0 Yrs (Nutanix, FinOS)',
    match: 94,
    location: 'Remote Pan-India',
    expectedCtc: '₹28 - ₹35 LPA',
    notice: 'Immediate (<15 Days)',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD Actions', 'AWS', 'Linux'],
    bio: 'DevOps & SRE specialist with extensive experience in automated multi-cloud provisioning and zero-downtime rollouts.',
  },
  {
    id: 4,
    name: 'Marcus Thorne',
    role: 'Lead Full Stack Engineer (React/Java)',
    exp: '8.0 Yrs (Shopify, Twilio)',
    match: 92,
    location: 'Bengaluru HSR',
    expectedCtc: '₹35 - ₹42 LPA',
    notice: '30 Days Notice',
    skills: ['React 18', 'Spring Boot', 'TypeScript', 'PostgreSQL', 'Microservices'],
    bio: 'Full stack practitioner creating modern enterprise dashboards and high-performance REST APIs.',
  },
  {
    id: 5,
    name: 'Rahul Sharma',
    role: 'Backend Software Engineer II',
    exp: '3.5 Yrs (TechCorp India, Razorpay)',
    match: 90,
    location: 'Mumbai (Hybrid)',
    expectedCtc: '₹18 - ₹24 LPA',
    notice: 'Immediate (<15 Days)',
    skills: ['Java 17', 'Spring Cloud', 'MySQL', 'REST APIs', 'Docker'],
    bio: 'Experienced backend developer proficient in Java microservices, database tuning, and API security.',
  },
  {
    id: 6,
    name: 'Sneha Kapoor',
    role: 'Senior Data & Stream Processing Engineer',
    exp: '5.5 Yrs (Flipkart, PhonePe)',
    match: 89,
    location: 'Bengaluru / Remote',
    expectedCtc: '₹30 - ₹38 LPA',
    notice: '15 Days Notice',
    skills: ['Apache Flink', 'Apache Kafka', 'Java', 'Spark', 'Cassandra'],
    bio: 'Data stream processing engineer building real-time event analytics and anomaly detection pipelines.',
  },
];

export default function TalentSourcing({ onExtendOffer }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExp, setSelectedExp] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [invitedList, setInvitedList] = useState([]);
  const [message, setMessage] = useState(null);

  const handleInvite = (candidate) => {
    setInvitedList((prev) => [...prev, candidate.id]);
    setMessage({ type: 'success', text: `Invitation to apply sent successfully to ${candidate.name}!` });
    setTimeout(() => setMessage(null), 3500);
  };

  const filteredCandidates = mockCandidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q)) ||
      c.exp.toLowerCase().includes(q);

    const matchExp =
      selectedExp === 'all' ||
      (selectedExp === 'senior' && parseFloat(c.exp) >= 5) ||
      (selectedExp === 'mid' && parseFloat(c.exp) >= 3 && parseFloat(c.exp) < 5) ||
      (selectedExp === 'junior' && parseFloat(c.exp) < 3);

    const matchLoc =
      selectedLocation === 'all' ||
      c.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchQuery && matchExp && matchLoc;
  });

  return (
    <div className="container py-4">
      {/* Subheader / Breadcrumb */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 bg-white rounded-3 border shadow-sm">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1 small text-uppercase">
              <li className="breadcrumb-item text-muted">Recruiter Console</li>
              <li className="breadcrumb-item text-primary fw-bold active">Talent Sourcing & Candidate Discovery</li>
            </ol>
          </nav>
          <h2 className="h4 mb-0 fw-bold text-dark">Verified Candidate Talent Pool</h2>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 d-flex align-items-center">
            <i className="bi bi-patch-check-fill me-1"></i> 1,248 Verified Engineers in Network
          </span>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type} py-2 small alert-dismissible fade show`} role="alert">
          {message.text}
        </div>
      )}

      <div className="row g-4">
        {/* Left Filter Sidebar */}
        <div className="col-lg-3">
          <div className="bg-white p-3 rounded-3 border shadow-sm sticky-top" style={{ top: '90px' }}>
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-funnel me-1 text-primary"></i> Sourcing Filters
            </h6>

            {/* Keyword */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Search Skills / Keywords</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Java, Kafka, Spring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Experience */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Experience Level</label>
              <select
                className="form-select form-select-sm"
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
              >
                <option value="all">All Experience Levels</option>
                <option value="senior">Senior / Lead (5+ Yrs)</option>
                <option value="mid">Mid-Level (3-5 Yrs)</option>
                <option value="junior">Entry / Junior (0-2 Yrs)</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Work Setup / Location</label>
              <select
                className="form-select form-select-sm"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Remote">Remote Pan-India</option>
              </select>
            </div>

            <button
              className="btn btn-outline-secondary btn-sm w-100 mt-2"
              onClick={() => {
                setSearchQuery('');
                setSelectedExp('all');
                setSelectedLocation('all');
              }}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Reset Filters
            </button>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="small text-muted">
              Showing <strong>{filteredCandidates.length}</strong> matching candidates
            </span>
          </div>

          <div className="row g-3">
            {filteredCandidates.map((candidate) => (
              <div className="col-12" key={candidate.id}>
                <div className="card border shadow-sm h-100 p-3 hover-lift">
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h5 className="mb-0 fw-bold text-dark">{candidate.name}</h5>
                        <span className="badge bg-success-subtle text-success border border-success-subtle small">
                          <i className="bi bi-shield-check me-1"></i> Verified Talent
                        </span>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle small">
                          {candidate.match}% ATS Match
                        </span>
                      </div>
                      <p className="text-primary fw-semibold mb-1 small">{candidate.role}</p>
                      <p className="text-muted small mb-2">{candidate.exp}</p>
                    </div>

                    <div className="text-end">
                      <span className="d-block text-success fw-bold">{candidate.expectedCtc}</span>
                      <small className="badge bg-light text-dark border">{candidate.notice}</small>
                    </div>
                  </div>

                  <p className="small text-muted mb-2">{candidate.bio}</p>

                  {/* Skills tags */}
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {candidate.skills.map((skill, idx) => (
                      <span key={idx} className="badge bg-light text-dark border small">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer CTAs */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 border-top">
                    <small className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i> {candidate.location}
                    </small>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm px-3"
                        onClick={() => handleInvite(candidate)}
                        disabled={invitedList.includes(candidate.id)}
                      >
                        <i className={`bi ${invitedList.includes(candidate.id) ? 'bi-check-circle-fill text-success' : 'bi-send'} me-1`}></i>
                        {invitedList.includes(candidate.id) ? 'Invited' : 'Invite to Apply'}
                      </button>

                      <button
                        className="btn btn-cobalt btn-sm px-3"
                        onClick={() => onExtendOffer && onExtendOffer(candidate)}
                      >
                        <i className="bi bi-file-earmark-text me-1"></i> Extend Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
