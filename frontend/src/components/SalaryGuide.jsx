import React, { useState } from 'react';

export default function SalaryGuide({ onSearchRole }) {
  const [selectedCity, setSelectedCity] = useState('All India');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  const salaryData = [
    {
      role: 'Full Stack Java Engineer (Spring Boot + React)',
      category: 'Engineering',
      entry: '₹6.5 - 9.5 LPA',
      mid: '₹14.0 - 22.0 LPA',
      senior: '₹26.0 - 42.0 LPA',
      growth: '+18% YoY',
      topSkills: ['Java 17+', 'Spring Boot', 'React.js', 'MySQL', 'Docker', 'Microservices'],
      demand: 'Very High',
    },
    {
      role: 'Fintech Backend Architect',
      category: 'Fintech & Security',
      entry: '₹9.0 - 14.0 LPA',
      mid: '₹20.0 - 32.0 LPA',
      senior: '₹38.0 - 65.0 LPA',
      growth: '+24% YoY',
      topSkills: ['Java', 'High-Throughput APIs', 'Kafka', 'JWT / OAuth2', 'PostgreSQL', 'AWS'],
      demand: 'Surging',
    },
    {
      role: 'Frontend Engineer (React / Next.js)',
      category: 'Engineering',
      entry: '₹5.5 - 8.5 LPA',
      mid: '₹12.0 - 18.5 LPA',
      senior: '₹22.0 - 35.0 LPA',
      growth: '+15% YoY',
      topSkills: ['React 18', 'TypeScript', 'State Management', 'Vite', 'CSS Architecture'],
      demand: 'High',
    },
    {
      role: 'Quantitative Financial Analyst',
      category: 'Finance & Analytics',
      entry: '₹7.5 - 11.0 LPA',
      mid: '₹16.0 - 25.0 LPA',
      senior: '₹30.0 - 48.0 LPA',
      growth: '+21% YoY',
      topSkills: ['Financial Modeling', 'Python', 'SQL / Database', 'Risk Analysis', 'Excel VBA'],
      demand: 'Very High',
    },
    {
      role: 'DevOps & Cloud Security Specialist',
      category: 'Infrastructure',
      entry: '₹7.0 - 10.5 LPA',
      mid: '₹15.0 - 24.0 LPA',
      senior: '₹28.0 - 46.0 LPA',
      growth: '+22% YoY',
      topSkills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux', 'AWS / Azure', 'Terraform'],
      demand: 'High',
    },
    {
      role: 'Data Engineer / Database Administrator',
      category: 'Data',
      entry: '₹6.0 - 9.0 LPA',
      mid: '₹13.5 - 20.0 LPA',
      senior: '₹25.0 - 38.0 LPA',
      growth: '+17% YoY',
      topSkills: ['MySQL Optimization', 'PostgreSQL', 'Apache Spark', 'Python', 'ETL Pipelines'],
      demand: 'High',
    },
  ];

  const filteredData = salaryData.filter((item) => {
    if (selectedRole !== 'All Roles' && item.category !== selectedRole) return false;
    return true;
  });

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="p-4 p-md-5 bg-white rounded-3 border shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-primary text-white mb-2">2026 Industry Benchmarks</span>
            <h2 className="display-6 fw-bold text-dark mb-2">Tech & Finance Salary Guide</h2>
            <p className="text-muted mb-3">
              Explore verified compensation benchmarks and market data across India's top software hubs and financial institutions.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-light text-dark border"><i className="bi bi-geo-alt me-1 text-danger"></i> Bangalore, Mumbai, Pune, Delhi NCR, Remote</span>
              <span className="badge bg-light text-dark border"><i className="bi bi-shield-check me-1 text-success"></i> Verified by 1,200+ Recruiters</span>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <div className="p-3 bg-light rounded-3 border text-start">
              <small className="text-muted fw-bold d-block text-uppercase" style={{ fontSize: '0.72rem' }}>Average Annual Increment</small>
              <div className="h3 fw-bold text-success mb-1">+19.4%</div>
              <small className="text-muted">for specialized Full Stack & Fintech roles</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-3 rounded-3 border shadow-sm">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="small fw-bold text-muted text-uppercase">Role Category:</span>
          {['All Roles', 'Engineering', 'Fintech & Security', 'Finance & Analytics', 'Infrastructure', 'Data'].map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedRole === cat ? 'btn-cobalt' : 'btn-outline-custom'}`}
              onClick={() => setSelectedRole(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted fw-semibold">City Tier:</span>
          <select
            className="form-select form-select-sm"
            style={{ width: '160px' }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="All India">All India (National)</option>
            <option value="Bangalore">Tier 1 - Bangalore</option>
            <option value="Mumbai">Tier 1 - Mumbai</option>
            <option value="Pune">Tier 1 - Pune / Hyderabad</option>
            <option value="Remote">Pan-India Remote</option>
          </select>
        </div>
      </div>

      {/* Salary Benchmark Cards */}
      <div className="row g-4">
        {filteredData.map((item, idx) => (
          <div className="col-lg-6" key={idx}>
            <div className="card h-100 border shadow-sm rounded-3 overflow-hidden">
              <div className="card-header bg-white p-3 border-bottom d-flex justify-content-between align-items-start">
                <div>
                  <span className="badge bg-light text-primary border mb-1">{item.category}</span>
                  <h5 className="fw-bold text-dark mb-0">{item.role}</h5>
                </div>
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  <i className="bi bi-graph-up-arrow me-1"></i> {item.growth}
                </span>
              </div>

              <div className="card-body p-3">
                <div className="row text-center g-2 mb-3">
                  <div className="col-4">
                    <div className="p-2 bg-light rounded-2 border">
                      <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Entry (0-2 Yrs)</small>
                      <strong className="text-dark small">{item.entry}</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-2 border" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                      <small className="text-primary fw-bold d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Mid (3-6 Yrs)</small>
                      <strong className="text-primary small">{item.mid}</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 bg-light rounded-2 border">
                      <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem' }}>Senior (7+ Yrs)</small>
                      <strong className="text-success small">{item.senior}</strong>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.7rem' }}>Key In-Demand Skills:</small>
                  <div className="d-flex flex-wrap gap-1">
                    {item.topSkills.map((sk) => (
                      <span key={sk} className="badge bg-light text-dark border small" style={{ fontSize: '0.72rem' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-footer bg-light p-3 border-top d-flex justify-content-between align-items-center">
                <small className="text-muted">Market Demand: <strong className="text-dark">{item.demand}</strong></small>
                <button
                  className="btn btn-outline-custom btn-sm py-1 px-3"
                  onClick={() => onSearchRole(item.role.split(' ')[0])}
                >
                  <i className="bi bi-search me-1"></i> View Openings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
