import React, { useState } from 'react';

export default function AuthModal({ isOpen, mode, onClose, onLogin, onRegister, onSwitchMode }) {
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('ROLE_SEEKER');
  const [companyName, setCompanyName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [bioOrSkills, setBioOrSkills] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        await onLogin(email, password);
        onClose();
      } else {
        await onRegister({
          name,
          email,
          password,
          role,
          companyName: role === 'ROLE_RECRUITER' ? companyName : null,
          contactNumber,
          bioOrSkills: role === 'ROLE_SEEKER' ? bioOrSkills : null,
        });
        setSuccessMsg('Registration successful! Logging you in...');
        setTimeout(async () => {
          await onLogin(email, password);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (type) => {
    if (type === 'recruiter') {
      setEmail('recruiter@jobfins.com');
      setPassword('password123');
    } else {
      setEmail('seeker@jobfins.com');
      setPassword('password123');
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(10,25,47,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark">
              <i className={`bi ${mode === 'login' ? 'bi-lock-fill text-primary' : 'bi-person-plus-fill text-success'} me-2`}></i>
              {mode === 'login' ? 'Sign In to JobFin' : 'Create an Account'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {successMsg && <div className="alert alert-success py-2 small">{successMsg}</div>}

            {mode === 'login' && (
              <div className="bg-light p-2 rounded mb-3 border d-flex justify-content-between align-items-center">
                <small className="text-muted fw-bold">Quick Demo Login:</small>
                <div className="btn-group btn-group-sm">
                  <button type="button" className="btn btn-outline-primary py-0" onClick={() => handleQuickDemoFill('recruiter')}>
                    Recruiter
                  </button>
                  <button type="button" className="btn btn-outline-success py-0" onClick={() => handleQuickDemoFill('seeker')}>
                    Seeker
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleAuthSubmit}>
              {mode === 'register' && (
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">I am a:</label>
                    <select
                      className="form-select form-select-sm"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="ROLE_SEEKER">Job Seeker (Applying for jobs)</option>
                      <option value="ROLE_RECRUITER">Job Recruiter (Hiring talent)</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Full Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                  </div>

                  {role === 'ROLE_RECRUITER' ? (
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Company / Organization</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. TechCorp Solutions"
                        required
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Key Skills</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={bioOrSkills}
                        onChange={(e) => setBioOrSkills(e.target.value)}
                        placeholder="e.g. Java, Spring Boot, MySQL, React"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Contact Number</label>
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <button type="submit" className="btn btn-cobalt w-100 py-2 btn-sm fw-bold" disabled={loading}>
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In with JWT' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-3 pt-2 border-top">
              {mode === 'login' ? (
                <small className="text-muted">
                  Don't have an account?{' '}
                  <a className="text-primary fw-bold cursor-pointer" onClick={() => onSwitchMode('register')}>
                    Register here
                  </a>
                </small>
              ) : (
                <small className="text-muted">
                  Already have an account?{' '}
                  <a className="text-primary fw-bold cursor-pointer" onClick={() => onSwitchMode('login')}>
                    Sign In
                  </a>
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
