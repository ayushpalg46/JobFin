import React, { useState } from 'react';

export default function CareerTips() {
  const [activeCategory, setActiveCategory] = useState('all');

  const tips = [
    {
      id: 1,
      category: 'resume',
      title: 'Top 7 Resume Rules for Full Stack & Fintech Roles in 2026',
      readTime: '4 min read',
      badge: 'Resume Prep',
      icon: 'bi-file-earmark-text',
      summary: 'How to structure your projects, quantifiable achievements, and technical stack to pass ATS filters effortlessly.',
      bulletPoints: [
        'Use standard section headings: Work Experience, Technical Skills, Projects, Education.',
        'Lead with impact: "Built Spring Boot & React platform handling 10k daily requests" instead of "Worked on backend".',
        'Explicitly state your core stack (Java 17, Spring Boot, MySQL, React, Docker) in a dedicated skills matrix.',
        'Always link live deployed projects or clean GitHub repositories with complete READMEs.',
      ],
    },
    {
      id: 2,
      category: 'interview',
      title: 'Cracking Full Stack Java System Design & Coding Interviews',
      readTime: '6 min read',
      badge: 'Technical Interviews',
      icon: 'bi-laptop',
      summary: 'Master key architectural concepts: REST API design, JPA caching, concurrency, and database indexing.',
      bulletPoints: [
        'Understand Spring Boot lifecycle, Dependency Injection, and stateless JWT token authentication.',
        'Be ready to explain ACID properties, database normalization vs indexing in MySQL.',
        'Demonstrate clean React state management, hooks (useState, useEffect), and responsive layout paradigms.',
        'Practice time-complexity analysis (Big-O) on standard data structures and algorithmic patterns.',
      ],
    },
    {
      id: 3,
      category: 'negotiation',
      title: 'How to Negotiate Your Salary Offer as a Software Engineer',
      readTime: '5 min read',
      badge: 'Salary & Offers',
      icon: 'bi-cash-stack',
      summary: 'Proven strategies to benchmark your worth, navigate recruiter counter-offers, and maximize total compensation.',
      bulletPoints: [
        'Research verifiable salary bands on JobFins Salary Guide before your final HR round.',
        'Focus on total compensation including base pay, performance bonuses, and equity/stock options.',
        'Always remain professional and communicate your enthusiasm for the team while requesting review.',
        'Have a clear walk-away number and negotiate based on the specific value you deliver.',
      ],
    },
    {
      id: 4,
      category: 'roadmap',
      title: '2026 Full Stack Developer Roadmap: Java, Cloud & Modern Frontend',
      readTime: '8 min read',
      badge: 'Career Roadmap',
      icon: 'bi-compass',
      summary: 'The comprehensive progression path from Junior Associate to Lead Architect.',
      bulletPoints: [
        'Milestone 1: Core Java 17+, OOP principles, Collections framework, and Maven/Gradle build tools.',
        'Milestone 2: Spring Boot 3, REST Web Services, JPA / Hibernate ORM, MySQL database tuning.',
        'Milestone 3: React.js component architecture, state management, modern CSS design systems.',
        'Milestone 4: Containerization with Docker, CI/CD automated deployment, and microservice patterns.',
      ],
    },
  ];

  const filteredTips = tips.filter((t) => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="p-4 p-md-5 bg-white rounded-3 border shadow-sm mb-4">
        <span className="badge bg-primary text-white mb-2">Knowledge Base & Advice</span>
        <h2 className="display-6 fw-bold text-dark mb-2">Career Advice & Interview Tips</h2>
        <p className="text-muted mb-0" style={{ maxWidth: '720px' }}>
          Expert guidance crafted by seasoned engineering leaders and corporate recruiters to help you excel at every stage of your career.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {[
          { id: 'all', label: 'All Articles' },
          { id: 'resume', label: 'Resume Engineering' },
          { id: 'interview', label: 'Technical Interviews' },
          { id: 'negotiation', label: 'Offer Negotiation' },
          { id: 'roadmap', label: 'Career Roadmaps' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`btn btn-sm ${activeCategory === tab.id ? 'btn-cobalt' : 'btn-outline-custom'}`}
            onClick={() => setActiveCategory(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="row g-4">
        {filteredTips.map((tip) => (
          <div className="col-lg-6" key={tip.id}>
            <div className="card h-100 border shadow-sm rounded-3 overflow-hidden">
              <div className="card-header bg-white p-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-light text-primary border">{tip.badge}</span>
                  <small className="text-muted"><i className="bi bi-clock me-1"></i>{tip.readTime}</small>
                </div>
                <h5 className="fw-bold text-dark mb-2">
                  <i className={`bi ${tip.icon} text-primary me-2`}></i>
                  {tip.title}
                </h5>
                <p className="text-muted small mb-0">{tip.summary}</p>
              </div>

              <div className="card-body p-4 bg-light">
                <h6 className="fw-bold text-dark small text-uppercase mb-2">Key Takeaways:</h6>
                <ul className="list-unstyled mb-0">
                  {tip.bulletPoints.map((point, i) => (
                    <li key={i} className="small text-muted mb-2 d-flex align-items-start gap-2">
                      <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1" style={{ fontSize: '0.85rem' }}></i>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-footer bg-white p-3 border-top text-end">
                <button className="btn btn-outline-custom btn-sm" onClick={() => alert('Tip bookmarked to your learning list!')}>
                  <i className="bi bi-bookmark me-1"></i> Bookmark Article
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
