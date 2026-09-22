import React, { useState } from 'react';

export default function CompanyDirectory({ onSelectCompany }) {
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All');

  const companies = [
    {
      id: 1,
      name: 'TechCorp Innovations',
      industry: 'Enterprise Software & Cloud',
      location: 'Bangalore, Karnataka',
      rating: 4.8,
      reviewsCount: 340,
      openingsCount: 8,
      logoColor: '#2563EB',
      description: 'Pioneering cloud-native microservices architecture, enterprise analytics, and modern web applications for Fortune 500 clients.',
      tags: ['Spring Boot', 'React.js', 'Docker', 'AWS'],
      benefits: ['Hybrid Work', 'Health Insurance', 'Stock Options', 'Annual Learning Stipend'],
    },
    {
      id: 2,
      name: 'FinTech Spark Global',
      industry: 'Banking & Financial Technology',
      location: 'Mumbai, Maharashtra',
      rating: 4.9,
      reviewsCount: 520,
      openingsCount: 12,
      logoColor: '#10B981',
      description: 'Next-generation core banking, digital ledger management, algorithmic trading systems, and ultra-secure transaction infrastructure.',
      tags: ['Java 17', 'Kafka', 'MySQL High-Availability', 'JWT Security'],
      benefits: ['Remote Friendly', 'Competitive Bonus', 'Wellness Program', 'Retirement Match'],
    },
    {
      id: 3,
      name: 'Nexus Data Labs',
      industry: 'Data Engineering & AI Solutions',
      location: 'Hyderabad, Telangana',
      rating: 4.7,
      reviewsCount: 190,
      openingsCount: 5,
      logoColor: '#6366F1',
      description: 'Building high-throughput data processing pipelines, real-time analytics dashboards, and predictive modeling platforms.',
      tags: ['Python', 'SQL', 'PostgreSQL', 'Apache Spark'],
      benefits: ['Flexible Hours', 'Parental Leave', 'Conference Sponsorship'],
    },
    {
      id: 4,
      name: 'CloudScale Technologies',
      industry: 'DevOps & Distributed Systems',
      location: 'Pune, Maharashtra',
      rating: 4.6,
      reviewsCount: 280,
      openingsCount: 6,
      logoColor: '#0EA5E9',
      description: 'Automating continuous integration, container orchestration, zero-downtime deployments, and immutable cloud infrastructure.',
      tags: ['Kubernetes', 'Docker', 'Linux', 'Terraform'],
      benefits: ['100% Remote Option', 'Home Office Allowance', 'Performance Incentives'],
    },
  ];

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = filterIndustry === 'All' || c.industry.includes(filterIndustry);
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="p-4 p-md-5 bg-white rounded-3 border shadow-sm mb-4">
        <span className="badge bg-primary text-white mb-2">Verified Employers</span>
        <h2 className="display-6 fw-bold text-dark mb-2">Top Hiring Companies</h2>
        <p className="text-muted mb-0" style={{ maxWidth: '720px' }}>
          Discover verified technology startups and financial enterprises actively hiring engineers, analysts, and architects.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 bg-white p-3 rounded-3 border shadow-sm">
        <div className="input-group" style={{ maxWidth: '380px' }}>
          <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search companies by name or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted fw-semibold">Industry:</span>
          <select
            className="form-select form-select-sm"
            style={{ width: '200px' }}
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
          >
            <option value="All">All Industries</option>
            <option value="Software">Enterprise Software</option>
            <option value="Banking">Banking & Fintech</option>
            <option value="Data">Data & AI</option>
            <option value="DevOps">DevOps & Cloud</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="row g-4">
        {filteredCompanies.map((comp) => (
          <div className="col-lg-6" key={comp.id}>
            <div className="card h-100 border shadow-sm rounded-3 overflow-hidden">
              <div className="card-header bg-white p-4 border-bottom">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center text-white fw-bold rounded-3 shadow-sm"
                      style={{ width: '48px', height: '48px', backgroundColor: comp.logoColor, fontSize: '1.25rem' }}
                    >
                      {comp.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-0">{comp.name}</h5>
                      <small className="text-muted"><i className="bi bi-geo-alt me-1 text-danger"></i>{comp.location}</small>
                    </div>
                  </div>
                  <span className="badge bg-warning text-dark border">
                    <i className="bi bi-star-fill text-warning me-1"></i>{comp.rating} ({comp.reviewsCount})
                  </span>
                </div>
                <p className="small text-muted mb-0 mt-3">{comp.description}</p>
              </div>

              <div className="card-body p-4 bg-light">
                <div className="mb-3">
                  <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.7rem' }}>Primary Tech Stack:</small>
                  <div className="d-flex flex-wrap gap-1">
                    {comp.tags.map((t) => (
                      <span key={t} className="badge bg-white text-dark border small" style={{ fontSize: '0.72rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.7rem' }}>Employee Benefits:</small>
                  <div className="d-flex flex-wrap gap-1">
                    {comp.benefits.map((b) => (
                      <span key={b} className="badge bg-success-subtle text-success border border-success-subtle small" style={{ fontSize: '0.72rem' }}>
                        <i className="bi bi-check me-1"></i>{b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-footer bg-white p-3 border-top d-flex justify-content-between align-items-center">
                <span className="badge bg-primary text-white">{comp.openingsCount} Active Openings</span>
                <button
                  className="btn btn-outline-custom btn-sm px-3"
                  onClick={() => onSelectCompany(comp.name)}
                >
                  <i className="bi bi-briefcase me-1"></i> View Jobs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
