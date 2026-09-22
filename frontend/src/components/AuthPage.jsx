import React, { useState } from 'react';

export default function AuthPage({ onLogin, onRegister, theme = 'light', onToggleTheme }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('ROLE_SEEKER'); // 'ROLE_SEEKER' or 'ROLE_RECRUITER'
  const [companyName, setCompanyName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [bioOrSkills, setBioOrSkills] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleQuickFill = (targetRole) => {
    setError(null);
    setSuccessMsg(null);
    setMode('login');
    if (targetRole === 'recruiter') {
      setEmail('recruiter@jobfins.com');
      setPassword('password123');
    } else {
      setEmail('seeker@jobfins.com');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please provide both email and password.');
        }
        await onLogin(email.trim(), password.trim());
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in all required fields.');
        }
        await onRegister({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
          companyName: role === 'ROLE_RECRUITER' ? companyName.trim() : null,
          contactNumber: contactNumber.trim(),
          bioOrSkills: role === 'ROLE_SEEKER' ? bioOrSkills.trim() : null,
        });

        setSuccessMsg('Registration successful! Logging you in...');
        setTimeout(async () => {
          await onLogin(email.trim(), password.trim());
        }, 1200);
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-gateway-wrapper d-flex align-items-center justify-content-center py-5 px-3 position-relative">
      {/* Floating Theme Switcher */}
      <div className="position-absolute top-0 end-0 m-4 z-3">
        <button
          className="btn btn-light shadow-sm border rounded-circle d-flex align-items-center justify-content-center p-2"
          style={{ width: '42px', height: '42px' }}
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning fs-5' : 'bi-moon-stars-fill text-primary fs-5'}`}></i>
        </button>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-7 col-xl-6">
            
            {/* Main Auth Card */}
            <div className="auth-glass-card shadow-lg rounded-4 overflow-hidden">
              
              {/* Brand Top Header */}
              <div className="auth-card-header text-center p-4 pb-3 border-bottom">
                <div className="d-flex justify-content-center mb-2">
                  <img src="/logo.svg" alt="JobFins Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <h4 className="fw-bold text-dark mb-1">
                  {mode === 'login' ? 'Welcome to JobFins' : 'Join the JobFins Network'}
                </h4>
                <p className="text-muted small mb-0">
                  {mode === 'login' 
                    ? 'Please sign in to access verified career opportunities and talent ATS' 
                    : 'Create your account to start applying or hiring top candidates'}
                </p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="px-4 pt-3">
                <div className="auth-tab-switch p-1 rounded-3 d-flex bg-light border">
                  <button
                    type="button"
                    className={`btn flex-fill py-2 fw-bold text-sm ${mode === 'login' ? 'btn-cobalt shadow-sm' : 'text-muted'}`}
                    onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill py-2 fw-bold text-sm ${mode === 'register' ? 'btn-cobalt shadow-sm' : 'text-muted'}`}
                    onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
                  >
                    <i className="bi bi-person-plus me-1"></i> Create Account
                  </button>
                </div>
              </div>

              {/* One-Click Quick Demo Bar */}
              <div className="px-4 pt-3">
                <div className="quick-demo-box p-2 rounded-3 border bg-white d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-1 text-muted small fw-semibold">
                    <i className="bi bi-lightning-charge-fill text-warning"></i>
                    <span>Quick Demo:</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm py-1 px-2 fw-semibold"
                      onClick={() => handleQuickFill('recruiter')}
                      title="Auto-fill Recruiter credentials"
                    >
                      <i className="bi bi-briefcase me-1"></i> Recruiter
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm py-1 px-2 fw-semibold"
                      onClick={() => handleQuickFill('seeker')}
                      title="Auto-fill Job Seeker credentials"
                    >
                      <i className="bi bi-person me-1"></i> Candidate
                    </button>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="px-4 pt-3">
                {error && (
                  <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-0">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <div>{error}</div>
                  </div>
                )}
                {successMsg && (
                  <div className="alert alert-success py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-0">
                    <i className="bi bi-check-circle-fill"></i>
                    <div>{successMsg}</div>
                  </div>
                )}
              </div>

              {/* Main Auth Form */}
              <form onSubmit={handleSubmit} className="p-4 pt-3">
                {mode === 'register' && (
                  <>
                    {/* Role Selection Segment */}
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-dark text-uppercase" style={{ fontSize: '0.72rem' }}>
                        Choose Account Role
                      </label>
                      <div className="row g-2">
                        <div className="col-6">
                          <div
                            className={`role-select-card p-2 rounded-3 border text-center cursor-pointer ${role === 'ROLE_SEEKER' ? 'active-role' : ''}`}
                            onClick={() => setRole('ROLE_SEEKER')}
                          >
                            <i className="bi bi-person-badge display-6 text-primary d-block mb-1"></i>
                            <div className="fw-bold small text-dark">Job Seeker</div>
                            <small className="text-muted" style={{ fontSize: '0.68rem' }}>Find & Apply to Jobs</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className={`role-select-card p-2 rounded-3 border text-center cursor-pointer ${role === 'ROLE_RECRUITER' ? 'active-role' : ''}`}
                            onClick={() => setRole('ROLE_RECRUITER')}
                          >
                            <i className="bi bi-building display-6 text-indigo d-block mb-1"></i>
                            <div className="fw-bold small text-dark">Recruiter</div>
                            <small className="text-muted" style={{ fontSize: '0.68rem' }}>Post & Hire Talent</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>
                        Full Name *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          required
                        />
                      </div>
                    </div>

                    {/* Recruiter / Seeker Dynamic Input */}
                    {role === 'ROLE_RECRUITER' ? (
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>
                          Company / Organization *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0"><i className="bi bi-building text-muted"></i></span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. TechCorp Innovations"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>
                          Key Skills & Expertise
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0"><i className="bi bi-code-slash text-muted"></i></span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            value={bioOrSkills}
                            onChange={(e) => setBioOrSkills(e.target.value)}
                            placeholder="e.g. Java, Spring Boot, MySQL, React"
                          />
                        </div>
                      </div>
                    )}

                    {/* Contact Number */}
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>
                        Contact Phone
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-telephone text-muted"></i></span>
                        <input
                          type="tel"
                          className="form-control border-start-0"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>
                    Email Address *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>
                      Password *
                    </label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"></i></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control border-start-0 border-end-0"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text bg-light border-start-0 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-cobalt w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <i className={`bi ${mode === 'login' ? 'bi-box-arrow-in-right' : 'bi-check2-circle'}`}></i>
                      <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Card Footer */}
              <div className="auth-card-footer p-3 bg-light text-center border-top">
                <small className="text-muted d-block mb-1">
                  {mode === 'login' ? "Don't have an account yet?" : "Already have an account?"}{' '}
                  <a
                    className="fw-bold text-primary cursor-pointer text-decoration-none"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                  >
                    {mode === 'login' ? 'Register Now' : 'Sign In'}
                  </a>
                </small>
                <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                  <i className="bi bi-shield-lock-fill text-success me-1"></i>
                  Protected with Secure HMAC-SHA256 JWT Authentication
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
