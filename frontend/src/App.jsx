import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import JobCard from './components/JobCard';
import JobDetailsModal from './components/JobDetailsModal';
import AuthModal from './components/AuthModal';
import AuthPage from './components/AuthPage';
import PostJobModal from './components/PostJobModal';
import RecruiterDashboard from './components/RecruiterDashboard';
import SeekerDashboard from './components/SeekerDashboard';
import TalentSourcing from './components/TalentSourcing';
import OfferBuilderModal from './components/OfferBuilderModal';
import SalaryGuide from './components/SalaryGuide';
import CareerTips from './components/CareerTips';
import CompanyDirectory from './components/CompanyDirectory';
import UserProfile from './components/UserProfile';
import NotificationDrawer from './components/NotificationDrawer';
import Footer from './components/Footer';
import { authService, jobService, applicationService, labService } from './services/api';

const getInitialNotifications = (role) => {
  if (role === 'ROLE_RECRUITER') {
    return [
      {
        id: 1,
        title: 'New Candidate Applied',
        message: 'Ayush Sharma (Java 17, Spring Boot, MySQL) submitted an application for "Java Backend Developer".',
        time: '5 mins ago',
        type: 'application',
        category: 'Inbound Applicant',
        icon: 'bi-person-plus-fill',
        read: false,
        actionView: 'recruiter-dashboard',
      },
      {
        id: 2,
        title: 'Talent Sourcing Match (98%)',
        message: 'Ayzen Vance (Ex-QuantFunds, 7.5 Yrs Exp) matches your requisition for Distributed Systems Lead.',
        time: '35 mins ago',
        type: 'sourcing',
        category: 'Talent Match',
        icon: 'bi-stars',
        read: false,
        actionView: 'talent-sourcing',
      },
      {
        id: 3,
        title: 'Interview Loop Pending',
        message: '2 shortlisted candidates are waiting for interview calendar slot confirmation.',
        time: '2 hours ago',
        type: 'interview',
        category: 'Hiring Pipeline',
        icon: 'bi-calendar-check',
        read: false,
        actionView: 'recruiter-dashboard',
      },
      {
        id: 4,
        title: 'Listing Impressions Spike',
        message: 'Your job posting "Cloud DevOps Engineer" received 124 new impressions and 8 saves today.',
        time: '4 hours ago',
        type: 'info',
        category: 'Analytics',
        icon: 'bi-graph-up-arrow',
        read: true,
        actionView: 'recruiter-dashboard',
      },
    ];
  } else {
    return [
      {
        id: 101,
        title: 'Application Shortlisted! 🎉',
        message: 'TechCorp Innovations reviewed your profile for "Java Backend Developer" and moved you to Shortlisted.',
        time: '12 mins ago',
        type: 'status',
        category: 'Status Update',
        icon: 'bi-patch-check-fill',
        read: false,
        actionView: 'seeker-dashboard',
      },
      {
        id: 102,
        title: 'Technical Interview Scheduled',
        message: 'TechCorp scheduled your Spring Boot & MySQL System Design round for Friday at 11:00 AM IST.',
        time: '1 hour ago',
        type: 'interview',
        category: 'Interview Invite',
        icon: 'bi-camera-video-fill',
        read: false,
        actionView: 'seeker-dashboard',
      },
      {
        id: 103,
        title: 'New High-Match Vacancy',
        message: 'CloudScale Technologies posted "Cloud DevOps Engineer (₹10-18 LPA)" matching your Docker & AWS skills.',
        time: '3 hours ago',
        type: 'application',
        category: 'Job Recommendation',
        icon: 'bi-briefcase-fill',
        read: false,
        actionView: 'home',
      },
      {
        id: 104,
        title: 'Profile Viewed by Recruiter',
        message: 'Lead Technical Recruiter from FinPay Solutions viewed your verified skills and resume.',
        time: '5 hours ago',
        type: 'info',
        category: 'Profile Activity',
        icon: 'bi-eye-fill',
        read: true,
        actionView: 'seeker-dashboard',
      },
    ];
  }
};

export default function App() {
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('jobfins_theme') || 'light';
  });

  // Authentication state
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Navigation view state: 'home', 'recruiter-dashboard', 'seeker-dashboard', 'salary-guide', 'companies', 'career-tips', 'profile'
  const [currentView, setCurrentView] = useState('home');

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Job portal states
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Selected job & Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerCandidate, setOfferCandidate] = useState(null);

  // Stats
  const [stats, setStats] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jobfins_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    checkSavedAuth();
    loadJobs();
    loadStats();
  }, []);

  // Filter jobs when search parameters change
  useEffect(() => {
    let result = jobs;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          j.requirements?.toLowerCase().includes(q)
      );
    }
    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase().trim();
      result = result.filter((j) => j.location?.toLowerCase().includes(loc));
    }
    if (typeFilter !== 'all') {
      result = result.filter((j) => j.jobType === typeFilter);
    }
    setFilteredJobs(result);
  }, [jobs, searchKeyword, locationFilter, typeFilter]);

  const checkSavedAuth = async () => {
    const token = localStorage.getItem('jobfins_token');
    const savedUser = localStorage.getItem('jobfins_user');
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setNotifications(getInitialNotifications(parsed.role));
      } catch (e) {
        localStorage.removeItem('jobfins_token');
        localStorage.removeItem('jobfins_user');
      }
    }
  };

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await jobService.getAllJobs();
      setJobs(res.data || []);
      setFilteredJobs(res.data || []);
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await labService.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleLogin = async (email, password) => {
    const res = await authService.login(email, password);
    const { token, id, name, role, companyName } = res.data;
    const userData = { id, name, email, role, companyName };
    localStorage.setItem('jobfins_token', token);
    localStorage.setItem('jobfins_user', JSON.stringify(userData));
    setUser(userData);
    setNotifications(getInitialNotifications(role));
    if (role === 'ROLE_RECRUITER') {
      setCurrentView('recruiter-dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const handleRegister = async (registerData) => {
    await authService.register(registerData);
  };

  const handleLogout = () => {
    localStorage.removeItem('jobfins_token');
    localStorage.removeItem('jobfins_user');
    setUser(null);
    setNotifications([]);
    setCurrentView('home');
  };

  const handleApplySubmit = async (jobId, applicationData) => {
    await applicationService.applyForJob(jobId, applicationData);
    loadStats();
    // Add applicant notification
    const newNotif = {
      id: Date.now(),
      title: 'Application Submitted',
      message: `Your application has been successfully transmitted to the hiring team.`,
      time: 'Just now',
      type: 'status',
      icon: 'bi-check-circle-fill',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleJobCreated = async (jobData) => {
    await jobService.createJob(jobData);
    loadJobs();
    loadStats();
    const newNotif = {
      id: Date.now(),
      title: 'Job Posting Published',
      message: `Your listing "${jobData.title}" is now active and receiving applicant impressions.`,
      time: 'Just now',
      type: 'info',
      icon: 'bi-megaphone-fill',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setNotificationsOpen(false);
    if (notif.actionView) {
      setCurrentView(notif.actionView);
    } else if (user?.role === 'ROLE_RECRUITER') {
      setCurrentView('recruiter-dashboard');
    } else {
      setCurrentView('seeker-dashboard');
    }
  };

  // If user is not authenticated, enforce the required Auth Gate
  if (!user) {
    return (
      <AuthPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Horizontal Navigation Bar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenLogin={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode('register');
          setAuthModalOpen(true);
        }}
        onOpenPostJob={() => setPostJobModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadCount={unreadCount}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        {currentView === 'recruiter-dashboard' && user?.role === 'ROLE_RECRUITER' ? (
          <RecruiterDashboard
            user={user}
            onOpenPostJob={() => setPostJobModalOpen(true)}
            onExtendOffer={(cand) => {
              setOfferCandidate(cand);
              setOfferModalOpen(true);
            }}
          />
        ) : currentView === 'talent-sourcing' && user?.role === 'ROLE_RECRUITER' ? (
          <TalentSourcing
            onExtendOffer={(cand) => {
              setOfferCandidate(cand);
              setOfferModalOpen(true);
            }}
          />
        ) : currentView === 'seeker-dashboard' && user?.role === 'ROLE_SEEKER' ? (
          <SeekerDashboard
            user={user}
            onFindJobs={() => setCurrentView('home')}
          />
        ) : currentView === 'profile' ? (
          <UserProfile
            user={user}
            onProfileUpdated={(updatedUser) => setUser(updatedUser)}
            onFindJobs={() => setCurrentView('home')}
          />
        ) : currentView === 'salary-guide' ? (
          <SalaryGuide
            onSearchRole={(roleTerm) => {
              setSearchKeyword(roleTerm);
              setCurrentView('home');
            }}
          />
        ) : currentView === 'companies' ? (
          <CompanyDirectory
            onSelectCompany={(companyName) => {
              setSearchKeyword(companyName);
              setCurrentView('home');
            }}
          />
        ) : currentView === 'career-tips' ? (
          <CareerTips />
        ) : (
          /* Home / Jobs View: Hero, Search Matrix, and Job Catalog */
          <>
            <HeroSearch
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              onSearch={loadJobs}
              stats={stats}
            />

            <section className="py-5" id="jobs-section">
              <div className="container">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="h4 mb-1 text-dark fw-bold">Featured Opportunities</h2>
                    <p className="text-muted small mb-0">
                      Showing {filteredJobs.length} verified jobs matching your criteria
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-custom btn-sm"
                    onClick={() => {
                      setSearchKeyword('');
                      setLocationFilter('');
                      setTypeFilter('all');
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i> Reset Filters
                  </button>
                </div>

                {loadingJobs ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-2 small">Loading opportunities...</p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-5 bg-white rounded-3 border shadow-sm">
                    <i className="bi bi-search display-5 text-muted mb-2 d-block"></i>
                    <h6 className="fw-bold text-dark">No matching job listings found</h6>
                    <p className="text-muted small">Try adjusting your search keywords or location filter.</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onSelectJob={(j) => {
                          setSelectedJob(j);
                          setDetailsModalOpen(true);
                        }}
                        onApplyJob={(j) => {
                          setSelectedJob(j);
                          setDetailsModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modals */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onApplySubmit={handleApplySubmit}
        user={user}
      />

      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      <PostJobModal
        isOpen={postJobModalOpen}
        onClose={() => setPostJobModalOpen(false)}
        onJobCreated={handleJobCreated}
        user={user}
        onOpenLogin={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
      />

      <OfferBuilderModal
        candidate={offerCandidate}
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        user={user}
      />

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        user={user}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
        onClearAll={handleClearAll}
      />

      {/* Footer */}
      <Footer
        onOpenLogin={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode('register');
          setAuthModalOpen(true);
        }}
        onOpenPostJob={() => setPostJobModalOpen(true)}
      />
    </div>
  );
}
