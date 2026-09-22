import React from 'react';

export default function HeroSearch({
  searchKeyword,
  setSearchKeyword,
  locationFilter,
  setLocationFilter,
  typeFilter,
  setTypeFilter,
  onSearch,
  stats,
}) {
  return (
    <section className="hero-section text-center">
      <div className="container">
        <h1 className="display-5 text-white fw-bold mb-3 hero-title">
          FIND YOUR NEXT OPPORTUNITY
        </h1>
        <p className="lead text-light opacity-90 mx-auto mb-4" style={{ maxWidth: '680px' }}>
          Search thousands of verified jobs across top tech startups and financial institutions with transparent salary metrics.
        </p>

        {/* Search Matrix Box */}
        <div className="search-matrix mx-auto my-4 text-start" style={{ maxWidth: '960px' }}>
          <div className="row g-2 align-items-center">
            {/* Input 1: Role / Keyword */}
            <div className="col-lg-4 col-md-6">
              <div className="search-input-group">
                <label><i className="bi bi-search me-1"></i> Keywords / Role</label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search jobs... (e.g. Java Backend Developer)"
                />
              </div>
            </div>

            {/* Input 2: Location */}
            <div className="col-lg-3 col-md-6">
              <div className="search-input-group">
                <label><i className="bi bi-geo-alt me-1"></i> Location</label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Mumbai, Bangalore, Remote"
                />
              </div>
            </div>

            {/* Input 3: Job Type */}
            <div className="col-lg-3 col-md-6">
              <div className="search-input-group">
                <label><i className="bi bi-briefcase me-1"></i> Job Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="col-lg-2 col-md-6">
              <button
                className="btn btn-cobalt w-100 py-3 d-flex align-items-center justify-content-center gap-1"
                onClick={onSearch}
              >
                <i className="bi bi-search"></i> Search
              </button>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="mt-3 pt-2 border-top d-flex flex-wrap align-items-center gap-2">
            <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.72rem' }}>Popular Tags:</small>
            {['Java', 'Spring Boot', 'React', 'Financial Analyst', 'Remote'].map((tag) => (
              <span
                key={tag}
                className="badge bg-light text-dark border cursor-pointer"
                onClick={() => {
                  setSearchKeyword(tag);
                  onSearch();
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="row g-3 justify-content-center mt-4">
          <div className="col-6 col-md-3">
            <div className="telemetry-card">
              <div className="stat-num">{stats?.totalJobs ? `${stats.totalJobs} Active` : '4 Active'}</div>
              <div className="stat-label">Verified Job Posts</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="telemetry-card">
              <div className="stat-num text-primary">{stats?.totalRecruiters || 2} Recruiters</div>
              <div className="stat-label">Top Hiring Companies</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="telemetry-card">
              <div className="stat-num text-success">{stats?.totalSeekers || 2} Candidates</div>
              <div className="stat-label">Registered Seekers</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="telemetry-card">
              <div className="stat-num text-info">98.4%</div>
              <div className="stat-label">Verified Placement Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
