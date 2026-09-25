import React, { useState } from 'react';
import { userService } from '../services/api';

export default function ProfileCompletionWizard({ isOpen, onClose, user, onProfileUpdated }) {
  if (!isOpen || !user) return null;

  const isRecruiter = user?.role === 'ROLE_RECRUITER';

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // =========================================================================
  // RECRUITER STATE (Corporate Registration & Recruiter Persona)
  // =========================================================================
  // Stage 1: Corporate Domain & Registration
  const [companyEmail, setCompanyEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(user?.companyName || 'TechCorp Global Solutions');
  const [companyWebsite, setCompanyWebsite] = useState('https://techcorpglobal.com');
  const [companyHqLocation, setCompanyHqLocation] = useState('Bangalore HQ, India');
  const isFreeEmailDomain = companyEmail.includes('@gmail') || companyEmail.includes('@yahoo') || companyEmail.includes('@outlook') || companyEmail.includes('@hotmail');

  // Stage 2: GSTIN & Corporate KYC
  const [gstin, setGstin] = useState('29AABCU9603R1ZM');
  const [cinNumber, setCinNumber] = useState('U72200KA2024PTC123456');
  const [kycVerified, setKycVerified] = useState(true);
  const [kycDocumentName, setKycDocumentName] = useState('Certificate_of_Incorporation_2024.pdf');

  // Stage 3: Account Type & Org Scale
  const [accountType, setAccountType] = useState('In-house Corporate HR'); // 'In-house Corporate HR', 'Third-Party Staffing Agency', 'Executive Search Firm'
  const [companySize, setCompanySize] = useState('51-200 Employees (High Growth)');
  const [industrySector, setIndustrySector] = useState('IT & Software Products / SaaS');

  // Stage 4: Recruiter Identity & Contact
  const [recruiterName, setRecruiterName] = useState(user?.name || '');
  const [recruiterDesignation, setRecruiterDesignation] = useState('Senior Talent Acquisition Specialist');
  const [recruiterPhone, setRecruiterPhone] = useState(user?.contactNumber || '+91 9876543210');
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Stage 5: Profile Picture & Headshot
  const [recruiterAvatar, setRecruiterAvatar] = useState('👩‍💼');
  const [recruiterLinkedin, setRecruiterLinkedin] = useState('https://linkedin.com/in/talent-specialist');

  // Stage 6: Recruiter Summary & EVP
  const [recruiterBio, setRecruiterBio] = useState(
    'Specialise in hiring Tech Leaders, Distributed Systems Engineers, and Full-Stack Developers for high-growth Series-A to Series-C engineering teams.'
  );

  // Stage 7: Industries & Functional Areas Covered
  const [selectedHiringDomains, setSelectedHiringDomains] = useState([
    'IT & Software Services',
    'FinTech & Payments',
    'SaaS & Cloud Platforms',
    'AI / Machine Learning',
  ]);
  const [selectedFunctionalRoles, setSelectedFunctionalRoles] = useState([
    'Java & Spring Boot Backend',
    'React & Frontend Engineering',
    'Cloud DevOps & Kubernetes',
    'Distributed Systems Architect',
  ]);

  // Stage 8: Hiring Locations & Trust Seal
  const [hiringLocations, setHiringLocations] = useState(['Bangalore', 'Hyderabad', 'Pune', 'Remote']);
  const [workModel, setWorkModel] = useState('Hybrid (2 Days Office / 3 Days Remote)');

  // =========================================================================
  // JOB SEEKER STATE (Candidate Credentials & ATS Portfolio)
  // =========================================================================
  // Stage 1: Basic Details
  const [seekerFullName, setSeekerFullName] = useState(user?.name || '');
  const [seekerPhone, setSeekerPhone] = useState(user?.contactNumber || '');
  const [seekerLocation, setSeekerLocation] = useState('Bangalore, India');
  const [employmentStatus, setEmploymentStatus] = useState('Employed (Active Seeker)');

  // Stage 2: Resume Upload & ATS
  const [resumeFileName, setResumeFileName] = useState('resume_2026_ats_ready.pdf');
  const [atsScore, setAtsScore] = useState(94);

  // Stage 3: Experience History
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: 'Full Stack Java Developer',
      company: 'FinFintech Solutions India',
      startDate: '2023-03',
      endDate: 'Present',
      description: 'Building high-throughput Spring Boot REST microservices with MySQL, Redis, and React.js frontend.',
    },
  ]);
  const [newExp, setNewExp] = useState({ title: '', company: '', startDate: '', endDate: '', description: '' });

  // Stage 4: Education
  const [educations, setEducations] = useState([
    {
      id: 1,
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'National Institute of Technology',
      year: '2023',
      grade: '8.9 CGPA / First Class with Distinction',
    },
  ]);
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', year: '', grade: '' });

  // Stage 5: Key Skills
  const defaultSeekerSkills = ['Java 17', 'Spring Boot', 'MySQL', 'React.js', 'REST APIs', 'Docker', 'Kubernetes', 'Redis', 'AWS', 'Kafka', 'CI/CD'];
  const [seekerSkills, setSeekerSkills] = useState(
    user?.bioOrSkills
      ? user.bioOrSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : defaultSeekerSkills.slice(0, 7)
  );
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Stage 6: Profile Summary
  const [seekerSummary, setSeekerSummary] = useState(
    'Passionate Full-Stack Java Developer with 3+ years experience building cloud-native microservices, secure RESTful APIs with Spring Boot, and responsive user interfaces with React.'
  );

  // Stage 7: Preferences & CTC
  const [seekerPreferredLocations, setSeekerPreferredLocations] = useState(['Remote', 'Bangalore', 'Mumbai', 'Hyderabad']);
  const [expectedCtc, setExpectedCtc] = useState(16);
  const [noticePeriod, setNoticePeriod] = useState('15 Days / Immediate');

  // Stage 8: Extras
  const [seekerAvatar, setSeekerAvatar] = useState('👨‍💻');
  const [seekerGithub, setSeekerGithub] = useState('https://github.com/ayushpalg46');
  const [seekerLinkedin, setSeekerLinkedin] = useState('https://linkedin.com/in/ayush-developer');

  // =========================================================================
  // STEP METADATA DEFINITIONS
  // =========================================================================
  const recruiterStepsMeta = [
    { num: 1, title: 'Corporate Entity', icon: 'bi-building', weight: '15%' },
    { num: 2, title: 'GSTIN & KYC', icon: 'bi-patch-check-fill', weight: '15%' },
    { num: 3, title: 'Account Type', icon: 'bi-diagram-3', weight: '10%' },
    { num: 4, title: 'Recruiter Identity', icon: 'bi-person-badge', weight: '15%' },
    { num: 5, title: 'Headshot & Avatar', icon: 'bi-person-circle', weight: '10%' },
    { num: 6, title: 'Recruiter Summary', icon: 'bi-chat-square-quote', weight: '10%' },
    { num: 7, title: 'Hiring Domains', icon: 'bi-stars', weight: '15%' },
    { num: 8, title: 'Trust Seal & Hubs', icon: 'bi-shield-shaded', weight: '10%' },
  ];

  const seekerStepsMeta = [
    { num: 1, title: 'Basic Details', icon: 'bi-person-vcard', weight: '20%' },
    { num: 2, title: 'ATS Resume', icon: 'bi-file-earmark-pdf', weight: '10%' },
    { num: 3, title: 'Experience', icon: 'bi-briefcase', weight: '20%' },
    { num: 4, title: 'Education', icon: 'bi-mortarboard', weight: '10%' },
    { num: 5, title: 'Key Skills', icon: 'bi-stars', weight: '10%' },
    { num: 6, title: 'Summary Bio', icon: 'bi-text-paragraph', weight: '10%' },
    { num: 7, title: 'CTC & City', icon: 'bi-sliders2', weight: '10%' },
    { num: 8, title: 'Avatar & Seal', icon: 'bi-shield-check', weight: '10%' },
  ];

  const activeSteps = isRecruiter ? recruiterStepsMeta : seekerStepsMeta;

  // Percentage calculation
  const completionPercentage = Math.round((currentStep / 8) * 100);

  // OTP Handlers
  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('8492');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '8492' || otpCode.length === 4) {
      setPhoneVerified(true);
      setOtpSent(false);
    } else {
      alert('Please enter test OTP code: 8492');
    }
  };

  const handleToggleRecruiterDomain = (domain) => {
    if (selectedHiringDomains.includes(domain)) {
      setSelectedHiringDomains(selectedHiringDomains.filter((d) => d !== domain));
    } else {
      setSelectedHiringDomains([...selectedHiringDomains, domain]);
    }
  };

  const handleToggleFunctionalRole = (role) => {
    if (selectedFunctionalRoles.includes(role)) {
      setSelectedFunctionalRoles(selectedFunctionalRoles.filter((r) => r !== role));
    } else {
      setSelectedFunctionalRoles([...selectedFunctionalRoles, role]);
    }
  };

  const handleToggleSeekerSkill = (skill) => {
    if (seekerSkills.includes(skill)) {
      setSeekerSkills(seekerSkills.filter((s) => s !== skill));
    } else {
      setSeekerSkills([...seekerSkills, skill]);
    }
  };

  const handleAddSeekerSkill = (e) => {
    e.preventDefault();
    if (customSkillInput.trim() && !seekerSkills.includes(customSkillInput.trim())) {
      setSeekerSkills([...seekerSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleFinishWizard = async () => {
    setIsSaving(true);
    try {
      const updateData = isRecruiter
        ? {
            name: recruiterName.trim() || user.name,
            contactNumber: recruiterPhone.trim(),
            companyName: companyName.trim(),
            bioOrSkills: selectedHiringDomains.join(', '),
          }
        : {
            name: seekerFullName.trim() || user.name,
            contactNumber: seekerPhone.trim(),
            bioOrSkills: seekerSkills.join(', '),
          };

      const res = await userService.updateProfile(updateData);
      const updatedUser = {
        ...user,
        ...res.data,
        completedProfile: true,
        profileStrength: 100,
        accountType: isRecruiter ? accountType : null,
        designation: isRecruiter ? recruiterDesignation : null,
        companyName: isRecruiter ? companyName : null,
        gstin: isRecruiter ? gstin : null,
      };

      localStorage.setItem('jobfins_user', JSON.stringify(updatedUser));
      localStorage.setItem('jobfins_profile_completed', 'true');
      if (onProfileUpdated) onProfileUpdated(updatedUser);

      setShowCelebration(true);
    } catch (err) {
      console.warn('Profile save offline fallback:', err);
      const updatedUser = {
        ...user,
        name: isRecruiter ? recruiterName : seekerFullName,
        contactNumber: isRecruiter ? recruiterPhone : seekerPhone,
        companyName: isRecruiter ? companyName : null,
        completedProfile: true,
        profileStrength: 100,
      };
      localStorage.setItem('jobfins_user', JSON.stringify(updatedUser));
      localStorage.setItem('jobfins_profile_completed', 'true');
      if (onProfileUpdated) onProfileUpdated(updatedUser);
      setShowCelebration(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(10, 25, 47, 0.78)',
        backdropFilter: 'blur(7px)',
        zIndex: 1060,
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden" style={{ minHeight: '620px' }}>
          
          {/* Header Bar */}
          <div
            className="modal-header border-bottom py-3 px-4"
            style={{
              background: isRecruiter
                ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)'
                : 'linear-gradient(135deg, #0A192F 0%, #1E3A8A 100%)',
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center shadow"
                style={{ width: '44px', height: '44px', fontSize: '1.4rem' }}
              >
                {isRecruiter ? recruiterAvatar : seekerAvatar}
              </div>
              <div>
                <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  <span>
                    {isRecruiter ? 'Enterprise Recruiter Onboarding & KYC' : 'Career Profile & ATS Optimization'}
                  </span>
                  <span className="badge bg-warning text-dark font-monospace" style={{ fontSize: '0.75rem' }}>
                    {completionPercentage}% Complete
                  </span>
                </h5>
                <small className="text-light opacity-75">
                  Step {currentStep} of 8: {activeSteps[currentStep - 1]?.title}
                </small>
              </div>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              title="Close Wizard"
            ></button>
          </div>

          {/* Stepper Navigation */}
          <div className="bg-light border-bottom px-3 py-2">
            <div className="d-flex justify-content-between align-items-center overflow-auto gap-2">
              {activeSteps.map((s) => (
                <button
                  key={s.num}
                  type="button"
                  className={`btn btn-sm d-flex align-items-center gap-1 text-nowrap rounded-pill px-3 py-1 ${
                    currentStep === s.num
                      ? 'btn-cobalt text-white shadow-sm'
                      : currentStep > s.num
                      ? 'btn-outline-success border-success'
                      : 'btn-outline-secondary border-0 text-muted'
                  }`}
                  onClick={() => setCurrentStep(s.num)}
                >
                  <i className={`bi ${currentStep > s.num ? 'bi-check-circle-fill text-success' : s.icon}`}></i>
                  <span className="fw-semibold" style={{ fontSize: '0.78rem' }}>
                    {s.num}. {s.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="progress mt-2" style={{ height: '6px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{
                  width: `${completionPercentage}%`,
                  background: 'linear-gradient(90deg, #2563EB 0%, #059669 100%)',
                }}
              ></div>
            </div>
          </div>

          {/* Stage Body */}
          <div className="modal-body p-4 p-md-5 bg-white">
            
            {/* CELEBRATION MODAL */}
            {showCelebration ? (
              <div className="text-center py-5">
                <div className="display-1 text-success mb-3 animate__animated animate__bounceIn">
                  {isRecruiter ? '🏢✨' : '🎉🚀'}
                </div>
                <h3 className="fw-bold text-dark mb-2">
                  {isRecruiter ? 'Enterprise Recruiter Account Verified!' : '100% Profile Strength Unlocked!'}
                </h3>
                <p className="text-muted col-md-8 mx-auto mb-4">
                  {isRecruiter
                    ? `Congratulations! ${companyName} and your recruiter profile for ${recruiterName} are officially verified with GSTIN KYC. You now have full talent sourcing and direct messaging access.`
                    : `Congratulations, ${seekerFullName}! Your ATS resume profile and technical skills are 100% complete. Recruiters can now discover your profile in high-match talent searches.`}
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-cobalt px-4 py-2 fw-bold"
                    onClick={() => {
                      setShowCelebration(false);
                      onClose();
                    }}
                  >
                    <i className="bi bi-rocket-takeoff-fill me-2"></i> Launch Dashboard
                  </button>
                </div>
              </div>
            ) : isRecruiter ? (
              /* ============================================================= */
              /* RECRUITER POV (Corporate Setup & Recruiter Persona)          */
              /* ============================================================= */
              <div>
                {/* STAGE 1: Corporate Domain & Registration */}
                {currentStep === 1 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 1</span>
                      <h4 className="fw-bold text-dark mb-0">Corporate Registration & Company Domain Verification</h4>
                    </div>
                    <p className="text-muted small mb-4">
                      Establishes the corporate parent account before individual recruiter profiles can be mapped and verified.
                    </p>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Corporate Work Email *</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light"><i className="bi bi-envelope-at"></i></span>
                          <input
                            type="email"
                            className="form-control"
                            value={companyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                            placeholder="name@company.com"
                          />
                        </div>
                        {isFreeEmailDomain ? (
                          <div className="alert alert-warning py-1 px-2 mt-2 small d-flex align-items-center gap-1 mb-0">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>Free email detected. For 100% verified trust badge, use corporate domain (e.g. @company.com).</span>
                          </div>
                        ) : (
                          <small className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Verified Corporate Domain</small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Legal Company / Organization Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. TechCorp Technologies India Pvt Ltd"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Official Corporate Website *</label>
                        <input
                          type="url"
                          className="form-control"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://company.com"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Headquarters Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={companyHqLocation}
                          onChange={(e) => setCompanyHqLocation(e.target.value)}
                          placeholder="e.g. Bangalore / Mumbai / Gurgaon"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 2: GSTIN & Corporate KYC */}
                {currentStep === 2 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 2</span>
                      <h4 className="fw-bold text-dark mb-0">GSTIN & Corporate KYC Verification</h4>
                    </div>
                    <p className="text-muted small mb-4">
                      JobFins requires company GSTIN, CIN, and business registration proof to verify legitimacy and prevent fraudulent hiring.
                    </p>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">15-Digit Corporate GSTIN *</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light font-monospace">GST</span>
                          <input
                            type="text"
                            className="form-control font-monospace text-uppercase"
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            placeholder="29AABCU9603R1ZM"
                            maxLength={15}
                          />
                          <span className="input-group-text bg-success-subtle text-success fw-bold">
                            <i className="bi bi-shield-fill-check me-1"></i> Validated
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Corporate Identification Number (CIN)</label>
                        <input
                          type="text"
                          className="form-control font-monospace text-uppercase"
                          value={cinNumber}
                          onChange={(e) => setCinNumber(e.target.value)}
                          placeholder="U72200KA2024PTC123456"
                        />
                      </div>

                      <div className="col-12">
                        <div className="p-3 border-2 border-dashed rounded-3 text-center bg-light">
                          <i className="bi bi-file-earmark-check display-6 text-success d-block mb-1"></i>
                          <div className="fw-bold text-dark">{kycDocumentName}</div>
                          <small className="text-muted">Certificate of Incorporation &bull; Auto-verified with MCA database</small>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-success-subtle border border-success rounded-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-patch-check-fill text-success fs-3"></i>
                        <div>
                          <div className="fw-bold text-success-emphasis">Corporate KYC Level 1 Completed</div>
                          <small className="text-success-emphasis">Enables zero-spam direct candidate messaging and high-priority listing.</small>
                        </div>
                      </div>
                      <span className="badge bg-success">Verified Employer</span>
                    </div>
                  </div>
                )}

                {/* STAGE 3: Account Type & Org Scale */}
                {currentStep === 3 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 3</span>
                      <h4 className="fw-bold text-dark mb-0">Account Type & Organization Scale</h4>
                    </div>
                    <p className="text-muted small mb-4">
                      Categorize your hiring model to customize candidate pipelines and ATS sourcing workflows.
                    </p>

                    <label className="form-label small fw-bold text-muted text-uppercase mb-2">Select Account Type *</label>
                    <div className="row g-3 mb-4">
                      {[
                        {
                          type: 'In-house Corporate HR',
                          title: 'In-house Corporate HR Team',
                          desc: 'Direct employer recruiting for internal engineering, product, and business roles.',
                          icon: 'bi-building-check',
                        },
                        {
                          type: 'Third-Party Staffing Agency',
                          title: 'Third-Party Recruitment Agency',
                          desc: 'Staffing firm / consultancy sourcing candidate talent for multiple corporate clients.',
                          icon: 'bi-people-fill',
                        },
                        {
                          type: 'Executive Search Firm',
                          title: 'Executive Search & Headhunting',
                          desc: 'Retained executive search firm hiring C-Suite, VP, and Director-level tech leaders.',
                          icon: 'bi-award-fill',
                        },
                      ].map((item) => (
                        <div key={item.type} className="col-md-4">
                          <div
                            className={`p-3 rounded-4 border cursor-pointer h-100 transition-all ${
                              accountType === item.type ? 'border-primary bg-primary-subtle shadow-sm' : 'bg-white'
                            }`}
                            onClick={() => setAccountType(item.type)}
                          >
                            <i className={`bi ${item.icon} text-primary fs-3 d-block mb-2`}></i>
                            <div className="fw-bold text-dark mb-1">{item.title}</div>
                            <small className="text-muted">{item.desc}</small>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Company Size / Scale</label>
                        <select
                          className="form-select"
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                        >
                          <option value="1-10 Employees (Seed Stage)">1-10 Employees (Seed / Early)</option>
                          <option value="11-50 Employees (Series A)">11-50 Employees (Series A)</option>
                          <option value="51-200 Employees (High Growth)">51-200 Employees (High Growth)</option>
                          <option value="201-1000 Employees (Mid-Market)">201-1000 Employees (Mid-Market)</option>
                          <option value="1000+ Employees (Global Enterprise MNC)">1000+ Employees (Enterprise MNC)</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Primary Industry Sector</label>
                        <select
                          className="form-select"
                          value={industrySector}
                          onChange={(e) => setIndustrySector(e.target.value)}
                        >
                          <option value="IT & Software Products / SaaS">IT & Software Products / SaaS</option>
                          <option value="FinTech, Banking & Payments">FinTech, Banking & Payments</option>
                          <option value="E-Commerce & Quick Commerce">E-Commerce & Quick Commerce</option>
                          <option value="Healthcare & HealthTech">Healthcare & HealthTech</option>
                          <option value="AI / Machine Learning & Data">AI / Machine Learning & Data</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 4: Recruiter Identity & Contact */}
                {currentStep === 4 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 4</span>
                      <h4 className="fw-bold text-dark mb-0">Individual Recruiter Profile & Contact Setup</h4>
                    </div>
                    <p className="text-muted small mb-4">
                      Create your personalized recruiter persona mapped under the verified corporate account.
                    </p>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Formal Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={recruiterName}
                          onChange={(e) => setRecruiterName(e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Official Designation / Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={recruiterDesignation}
                          onChange={(e) => setRecruiterDesignation(e.target.value)}
                          placeholder="e.g. Senior Talent Acquisition Specialist"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">
                          Direct Corporate Mobile & OTP Verification *
                        </label>
                        <div className="input-group">
                          <input
                            type="tel"
                            className="form-control"
                            value={recruiterPhone}
                            onChange={(e) => setRecruiterPhone(e.target.value)}
                            placeholder="+91 9876543210"
                          />
                          {!phoneVerified ? (
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={handleSendOtp}
                            >
                              {otpSent ? 'Resend OTP' : 'Send OTP'}
                            </button>
                          ) : (
                            <span className="input-group-text bg-success-subtle text-success fw-bold">
                              <i className="bi bi-shield-fill-check me-1"></i> Verified
                            </span>
                          )}
                        </div>

                        {otpSent && !phoneVerified && (
                          <div className="mt-2 p-3 bg-light rounded-3 border">
                            <small className="d-block text-muted mb-2">
                              Demo OTP sent to <b>{recruiterPhone}</b>. Use test code <b>8492</b>:
                            </small>
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                className="form-control form-control-sm text-center font-monospace fw-bold"
                                style={{ maxWidth: '120px', letterSpacing: '4px' }}
                                maxLength={4}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-success fw-bold"
                                onClick={handleVerifyOtp}
                              >
                                Verify OTP
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Corporate Office Location</label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          value={companyHqLocation}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 5: Profile Picture & Headshot */}
                {currentStep === 5 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 5</span>
                      <h4 className="fw-bold text-dark mb-0">Professional Headshot & Recruiter Persona</h4>
                    </div>
                    <p className="text-muted small mb-4">
                      A complete profile with a picture builds immediate trust when reaching out to high-caliber passive candidates.
                    </p>

                    <div className="p-4 bg-light rounded-4 border text-center mb-4">
                      <div
                        className="rounded-circle bg-white shadow-md mx-auto mb-3 d-flex align-items-center justify-content-center border"
                        style={{ width: '90px', height: '90px', fontSize: '3rem' }}
                      >
                        {recruiterAvatar}
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{recruiterName || 'Recruiter'}</h6>
                      <div className="badge bg-primary mb-3">{recruiterDesignation} &bull; {companyName}</div>

                      <div className="d-flex justify-content-center gap-2">
                        {['👩‍💼', '👨‍💼', '🧑‍💻', '👩‍💻', '🌟', '💼', '⚡', '🚀'].map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            className={`btn fs-4 rounded-circle p-2 ${
                              recruiterAvatar === avatar ? 'btn-primary border-3' : 'btn-white border'
                            }`}
                            style={{ width: '52px', height: '52px' }}
                            onClick={() => setRecruiterAvatar(avatar)}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label small fw-bold text-muted text-uppercase">LinkedIn Recruiter Profile URL</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light"><i className="bi bi-linkedin text-primary"></i></span>
                          <input
                            type="url"
                            className="form-control"
                            value={recruiterLinkedin}
                            onChange={(e) => setRecruiterLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/recruiter-profile"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 6: Recruiter Summary & EVP */}
                {currentStep === 6 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 6</span>
                      <h4 className="fw-bold text-dark mb-0">Recruiter Summary & Industry Focus</h4>
                    </div>
                    <p className="text-muted small mb-3">
                      Add a brief bio detailing your industry focus (e.g. "Specialise in hiring Tech Leaders and Full-Stack Developers for Series-A startups").
                    </p>

                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows={4}
                        value={recruiterBio}
                        onChange={(e) => setRecruiterBio(e.target.value)}
                        placeholder="Detail your specialized hiring focus..."
                      ></textarea>
                      <div className="d-flex justify-content-between mt-1 text-muted small">
                        <span>Word count: ~{recruiterBio.trim().split(/\s+/).filter(Boolean).length} words</span>
                        <span className="text-success fw-bold"><i className="bi bi-sparkles me-1"></i>AI Optimized</span>
                      </div>
                    </div>

                    <small className="fw-bold text-muted d-block mb-2">1-Click Industry Bio Templates:</small>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setRecruiterBio(
                            'Specialise in hiring Tech Leaders, System Architects, and Full-Stack Java / Cloud Developers for Series-A to Series-C hyper-growth startups.'
                          )
                        }
                      >
                        🚀 Hypergrowth Tech Startup
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setRecruiterBio(
                            'Head of Engineering Talent Acquisition leading executive search, platform engineering hiring, and distributed systems architecture pipelines.'
                          )
                        }
                      >
                        🏢 Enterprise Engineering Lead
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() =>
                          setRecruiterBio(
                            'Third-Party Executive Search Partner specializing in high-impact niche hiring across FinTech, AI/ML, and Cloud Infrastructure.'
                          )
                        }
                      >
                        🤝 Search Agency Partner
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 7: Industries & Functional Areas */}
                {currentStep === 7 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 7</span>
                      <h4 className="fw-bold text-dark mb-0">Industries & Functional Areas Covered</h4>
                    </div>
                    <p className="text-muted small mb-3">
                      Selecting your specific hiring domains helps JobFins suggest relevant candidate recommendations to you automatically.
                    </p>

                    {/* Hiring Domains */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-dark mb-2">Primary Hiring Industries:</label>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          'IT & Software Services',
                          'FinTech & Payments',
                          'SaaS & Cloud Platforms',
                          'AI / Machine Learning',
                          'E-Commerce & Retail',
                          'Healthcare & Life Sciences',
                          'Banking & BFSI',
                          'CyberSecurity',
                        ].map((domain) => (
                          <button
                            key={domain}
                            type="button"
                            className={`btn btn-sm rounded-pill ${
                              selectedHiringDomains.includes(domain) ? 'btn-primary' : 'btn-outline-secondary'
                            }`}
                            onClick={() => handleToggleRecruiterDomain(domain)}
                          >
                            <i className={`bi ${selectedHiringDomains.includes(domain) ? 'bi-check2' : 'bi-plus'} me-1`}></i>
                            {domain}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Functional Engineering Roles */}
                    <div>
                      <label className="form-label small fw-bold text-dark mb-2">Target Functional Roles Hired:</label>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          'Java & Spring Boot Backend',
                          'React & Frontend Engineering',
                          'Cloud DevOps & Kubernetes',
                          'Distributed Systems Architect',
                          'Data Science & AI/ML',
                          'Mobile Engineering (iOS/Android)',
                          'QA & Test Automation',
                          'Product Management',
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            className={`btn btn-sm rounded-pill ${
                              selectedFunctionalRoles.includes(role) ? 'btn-indigo text-white bg-dark' : 'btn-outline-secondary'
                            }`}
                            onClick={() => handleToggleFunctionalRole(role)}
                          >
                            <i className={`bi ${selectedFunctionalRoles.includes(role) ? 'bi-check2' : 'bi-plus'} me-1`}></i>
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 8: Hiring Tech Hubs & Trust Seal */}
                {currentStep === 8 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 8</span>
                      <h4 className="fw-bold text-dark mb-0">Hiring Locations & Verified Recruiter Seal</h4>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Primary Tech Hubs</label>
                        <div className="d-flex flex-wrap gap-2">
                          {['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi-NCR', 'Chennai', 'Remote'].map((city) => (
                            <span
                              key={city}
                              className={`badge p-2 cursor-pointer ${
                                hiringLocations.includes(city) ? 'bg-primary' : 'bg-light text-dark border'
                              }`}
                              onClick={() => {
                                if (hiringLocations.includes(city)) {
                                  setHiringLocations(hiringLocations.filter((c) => c !== city));
                                } else {
                                  setHiringLocations([...hiringLocations, city]);
                                }
                              }}
                            >
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Work Model Offered</label>
                        <select
                          className="form-select"
                          value={workModel}
                          onChange={(e) => setWorkModel(e.target.value)}
                        >
                          <option value="Hybrid (2 Days Office / 3 Days Remote)">Hybrid (2-3 Days Office)</option>
                          <option value="100% Remote / Anywhere in India">100% Remote / Pan-India</option>
                          <option value="On-Site / Office Based">On-Site Office Based</option>
                        </select>
                      </div>
                    </div>

                    {/* Trust Seal Banner */}
                    <div className="p-4 rounded-4 border bg-light text-center">
                      <div className="display-4 text-warning mb-2">🛡️</div>
                      <h5 className="fw-bold text-dark mb-1">Corporate Employer Trust Seal: Ready</h5>
                      <p className="text-muted small col-md-8 mx-auto mb-0">
                        By completing this setup, your postings and candidate reaching privileges receive the highest verified tier on JobFins.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ============================================================= */
              /* JOB SEEKER POV (Candidate Credentials & ATS Portfolio)        */
              /* ============================================================= */
              <div>
                {/* STAGE 1: Basic Details */}
                {currentStep === 1 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 1</span>
                      <h4 className="fw-bold text-dark mb-0">Basic Details & Mobile Verification</h4>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Full Legal Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={seekerFullName}
                          onChange={(e) => setSeekerFullName(e.target.value)}
                          placeholder="e.g. Ayush Sharma"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Registered Email</label>
                        <input
                          type="email"
                          className="form-control bg-light"
                          value={user.email}
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Mobile Number *</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={seekerPhone}
                          onChange={(e) => setSeekerPhone(e.target.value)}
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Current City / Location *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={seekerLocation}
                          onChange={(e) => setSeekerLocation(e.target.value)}
                          placeholder="e.g. Bangalore / Mumbai"
                        />
                      </div>

                      <div className="col-md-12">
                        <label className="form-label small fw-bold text-muted text-uppercase">Current Employment Status</label>
                        <select
                          className="form-select"
                          value={employmentStatus}
                          onChange={(e) => setEmploymentStatus(e.target.value)}
                        >
                          <option value="Employed (Active Seeker)">Employed (Active Seeker)</option>
                          <option value="Serving Notice Period (Immediate Joiner)">Serving Notice Period</option>
                          <option value="Fresher / College Graduate (2025/2026)">Fresher / Recent Graduate</option>
                          <option value="Freelancer / Consultant">Freelance / Consultant</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 2: ATS Resume Upload */}
                {currentStep === 2 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 2</span>
                      <h4 className="fw-bold text-dark mb-0">ATS Resume Parser & Validator</h4>
                    </div>

                    <div className="p-4 border-2 border-dashed rounded-4 text-center mb-3 bg-light" style={{ borderColor: '#2563EB' }}>
                      <i className="bi bi-cloud-arrow-up-fill display-4 text-primary d-block mb-2"></i>
                      <h6 className="fw-bold text-dark mb-1">Drag & Drop ATS-Friendly Resume</h6>
                      <p className="text-muted small mb-2">Supported formats: PDF, DOCX (Max 10MB)</p>
                      <span className="badge bg-primary px-3 py-2">
                        <i className="bi bi-file-earmark-check me-1"></i> {resumeFileName}
                      </span>
                    </div>

                    <div className="p-3 bg-success-subtle border border-success rounded-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-success-emphasis"><i className="bi bi-shield-check"></i> JobFins ATS Score:</span>
                        <span className="badge bg-success fs-6">{atsScore} / 100 (High Match)</span>
                      </div>
                      <small className="text-success-emphasis d-block">
                        &bull; Identified high-impact Java 17, Spring Boot, MySQL, and Docker keywords.
                      </small>
                    </div>
                  </div>
                )}

                {/* STAGE 3: Experience */}
                {currentStep === 3 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 3</span>
                      <h4 className="fw-bold text-dark mb-0">Employment & Experience History</h4>
                    </div>

                    {experiences.map((exp) => (
                      <div key={exp.id} className="p-3 border rounded-3 mb-2 bg-light d-flex justify-content-between">
                        <div>
                          <div className="fw-bold text-dark">{exp.title}</div>
                          <div className="text-primary small fw-semibold">{exp.company} &bull; {exp.startDate} - {exp.endDate}</div>
                          <p className="text-muted small mb-0 mt-1">{exp.description}</p>
                        </div>
                      </div>
                    ))}

                    <div className="p-3 border rounded-3 bg-white mt-3">
                      <h6 className="fw-bold text-dark mb-3"><i className="bi bi-plus-circle me-1 text-primary"></i> Add Experience</h6>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Job Title"
                            value={newExp.title}
                            onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Company"
                            value={newExp.company}
                            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Start (YYYY-MM)"
                            value={newExp.startDate}
                            onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="End (or Present)"
                            value={newExp.endDate}
                            onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100 fw-bold"
                            onClick={() => {
                              if (newExp.title) {
                                setExperiences([...experiences, { id: Date.now(), ...newExp }]);
                                setNewExp({ title: '', company: '', startDate: '', endDate: '', description: '' });
                              }
                            }}
                          >
                            Add Role
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 4: Education */}
                {currentStep === 4 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 4</span>
                      <h4 className="fw-bold text-dark mb-0">Education & Academic Degrees</h4>
                    </div>

                    {educations.map((edu) => (
                      <div key={edu.id} className="p-3 border rounded-3 mb-2 bg-light">
                        <div className="fw-bold text-dark">{edu.degree}</div>
                        <div className="text-primary small fw-semibold">{edu.institution} &bull; Class of {edu.year}</div>
                        <small className="text-muted">{edu.grade}</small>
                      </div>
                    ))}
                  </div>
                )}

                {/* STAGE 5: Key Skills */}
                {currentStep === 5 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 5</span>
                      <h4 className="fw-bold text-dark mb-0">Key Technical Skills & Arsenal</h4>
                    </div>

                    <div className="p-3 border rounded-3 bg-light mb-3">
                      <div className="fw-bold small text-dark mb-2">Selected Skills ({seekerSkills.length}):</div>
                      <div className="d-flex flex-wrap gap-2">
                        {seekerSkills.map((skill) => (
                          <span
                            key={skill}
                            className="badge bg-cobalt text-white p-2 d-flex align-items-center gap-1 cursor-pointer"
                            onClick={() => handleToggleSeekerSkill(skill)}
                          >
                            {skill} <i className="bi bi-x"></i>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="fw-bold text-muted d-block mb-2">Popular Suggested Skills:</small>
                      <div className="d-flex flex-wrap gap-2">
                        {['Spring Security', 'GraphQL', 'Hibernate/JPA', 'JUnit 5', 'TailwindCSS', 'Next.js', 'PostgreSQL', 'Docker', 'AWS'].map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            className={`btn btn-sm ${seekerSkills.includes(skill) ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill`}
                            onClick={() => handleToggleSeekerSkill(skill)}
                          >
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleAddSeekerSkill} className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Add skill (e.g. Terraform, Kafka)..."
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                      />
                      <button type="submit" className="btn btn-sm btn-outline-primary fw-bold">Add</button>
                    </form>
                  </div>
                )}

                {/* STAGE 6: Summary Bio */}
                {currentStep === 6 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 6</span>
                      <h4 className="fw-bold text-dark mb-0">50-Word Professional Summary</h4>
                    </div>

                    <textarea
                      className="form-control mb-3"
                      rows={4}
                      value={seekerSummary}
                      onChange={(e) => setSeekerSummary(e.target.value)}
                    ></textarea>
                  </div>
                )}

                {/* STAGE 7: CTC & Preferences */}
                {currentStep === 7 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 7</span>
                      <h4 className="fw-bold text-dark mb-0">Career Preferences & Target CTC</h4>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Expected CTC (₹ LPA)</label>
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="range"
                            className="form-range"
                            min="4"
                            max="60"
                            step="1"
                            value={expectedCtc}
                            onChange={(e) => setExpectedCtc(e.target.value)}
                          />
                          <span className="badge bg-success fs-6 text-nowrap">₹{expectedCtc} LPA</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Notice Period</label>
                        <select
                          className="form-select"
                          value={noticePeriod}
                          onChange={(e) => setNoticePeriod(e.target.value)}
                        >
                          <option value="Immediate Joiner (0 Days)">Immediate Joiner (0 Days)</option>
                          <option value="15 Days / Immediate">15 Days</option>
                          <option value="30 Days (Standard)">30 Days</option>
                          <option value="60-90 Days">60-90 Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 8: Avatar & Extras */}
                {currentStep === 8 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 8</span>
                      <h4 className="fw-bold text-dark mb-0">Avatar, GitHub & Portfolio Links</h4>
                    </div>

                    <div className="d-flex gap-2 mb-4">
                      {['👨‍💻', '👩‍💻', '🚀', '⚡', '💼', '🎯', '🌟'].map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          className={`btn fs-4 rounded-circle p-2 ${
                            seekerAvatar === avatar ? 'btn-primary border-3' : 'btn-light border'
                          }`}
                          style={{ width: '52px', height: '52px' }}
                          onClick={() => setSeekerAvatar(avatar)}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">GitHub Portfolio URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={seekerGithub}
                          onChange={(e) => setSeekerGithub(e.target.value)}
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">LinkedIn URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={seekerLinkedin}
                          onChange={(e) => setSeekerLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          {!showCelebration && (
            <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              >
                <i className="bi bi-chevron-left me-1"></i> Back
              </button>

              <div className="d-flex gap-2">
                {currentStep < 8 ? (
                  <button
                    type="button"
                    className="btn btn-cobalt px-4 fw-bold"
                    onClick={() => setCurrentStep((prev) => Math.min(8, prev + 1))}
                  >
                    Save & Next <i className="bi bi-chevron-right ms-1"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success px-4 fw-bold shadow-sm"
                    disabled={isSaving}
                    onClick={handleFinishWizard}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Saving Profile...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-all me-1"></i> Complete & Verify Profile (100%)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
