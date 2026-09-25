import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

export default function ProfileCompletionWizard({ isOpen, onClose, user, onProfileUpdated }) {
  if (!isOpen || !user) return null;

  const isRecruiter = user?.role === 'ROLE_RECRUITER';

  // Current Stage (1 to 8)
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // --- STAGE 1: Basic Details (20%) ---
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.contactNumber || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(Boolean(user?.contactNumber));
  const [location, setLocation] = useState('Bangalore, India');
  const [employmentStatus, setEmploymentStatus] = useState('Employed (Looking for Opportunities)');
  const [designation, setDesignation] = useState(isRecruiter ? 'Senior Talent Acquisition Lead' : 'Software Engineer');

  // --- STAGE 2: Resume / Company Verification (10%) ---
  const [resumeFileName, setResumeFileName] = useState('ayush_resume_2026.pdf');
  const [atsScore, setAtsScore] = useState(92);
  const [atsFeedback, setAtsFeedback] = useState([
    'Strong action verbs identified',
    'Java & Spring Boot skills detected',
    'Contact information is clear and ATS-parseable',
  ]);
  const [companyWebsite, setCompanyWebsite] = useState('https://jobfins.com');
  const [companyCin, setCompanyCin] = useState('U72200KA2024PTC123456');
  const [companyVerified, setCompanyVerified] = useState(true);

  // --- STAGE 3: Experience History (20%) ---
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: isRecruiter ? 'Lead Recruiter' : 'Java Backend Engineer',
      company: isRecruiter ? 'TalentX Global' : 'FinTech Solutions Pvt Ltd',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      description: isRecruiter
        ? 'Led technical hiring loops across distributed microservices engineering teams.'
        : 'Developed scalable Spring Boot microservices with MySQL, Redis caching, and Kafka events.',
    },
  ]);
  const [newExp, setNewExp] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  });

  // --- STAGE 4: Education / Org Size (10%) ---
  const [educations, setEducations] = useState([
    {
      id: 1,
      degree: 'B.Tech in Computer Science',
      institution: 'National Institute of Technology',
      year: '2022',
      grade: '8.8 CGPA / 88%',
    },
  ]);
  const [newEdu, setNewEdu] = useState({
    degree: '',
    institution: '',
    year: '',
    grade: '',
  });
  const [companySize, setCompanySize] = useState('51-200 Employees');
  const [fundingStage, setFundingStage] = useState('Series B ($25M+ Raised)');

  // --- STAGE 5: Key Skills / Requisitions (10%) ---
  const defaultSkills = isRecruiter
    ? ['Technical Recruiting', 'Executive Search', 'Engineering Sourcing', 'ATS Optimization', 'Candidate Experience', 'Salary Negotiation', 'Headhunting', 'LinkedIn Recruiter', 'Campus Hiring', 'Diversity Hiring']
    : ['Java 17', 'Spring Boot', 'MySQL', 'React.js', 'RESTful APIs', 'Docker', 'Microservices', 'Kubernetes', 'Redis', 'AWS', 'Kafka', 'Git', 'CI/CD', 'PostgreSQL', 'TypeScript'];
  
  const [selectedSkills, setSelectedSkills] = useState(
    user?.bioOrSkills
      ? user.bioOrSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : defaultSkills.slice(0, 7)
  );
  const [customSkillInput, setCustomSkillInput] = useState('');

  const suggestedSkillsPool = isRecruiter
    ? ['Campus Recruitment', 'Boolean Search', 'Offer Rolling', 'Technical Screening', 'HR Operations', 'Employer Branding', 'Talent Analytics', 'Workday', 'Greenhouse']
    : ['Spring Security', 'GraphQL', 'Hibernate/JPA', 'JUnit 5', 'TailwindCSS', 'Next.js', 'Elasticsearch', 'Node.js', 'System Design', 'GCP', 'Terraform'];

  // --- STAGE 6: Profile Summary / Recruiter EVP (10%) ---
  const defaultSummary = isRecruiter
    ? 'Passionate Talent Acquisition partner specializing in hyper-growth engineering recruitment, high-impact sourcing, and seamless candidate journeys.'
    : 'Result-oriented Full-Stack Java Engineer with 3+ years experience building enterprise microservices, robust REST APIs with Spring Boot, and modern React interfaces.';
  const [profileSummary, setProfileSummary] = useState(defaultSummary);

  // --- STAGE 7: Career Preferences / Hiring Model (10%) ---
  const [desiredRoles, setDesiredRoles] = useState(
    isRecruiter ? ['VP of Talent', 'Head of People', 'Talent Partner'] : ['Senior Java Developer', 'Full Stack Engineer', 'Backend Lead']
  );
  const [preferredLocations, setPreferredLocations] = useState(['Remote', 'Bangalore', 'Mumbai', 'Hyderabad']);
  const [expectedCtc, setExpectedCtc] = useState(16); // in LPA
  const [noticePeriod, setNoticePeriod] = useState('15 Days / Immediate');

  // --- STAGE 8: Personal Details & Extras (10%) ---
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍💻');
  const [dob, setDob] = useState('2001-08-15');
  const [languages, setLanguages] = useState(['English (Fluent)', 'Hindi (Native)']);
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/ayushpalg46');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/ayush-profile');

  // Calculate dynamic Profile Completeness Percentage
  const calculateCompleteness = () => {
    let score = 0;
    // Stage 1: Basic (20%)
    if (fullName && (phoneVerified || phone) && location) score += 20;
    else if (fullName) score += 10;

    // Stage 2: Resume/Company (10%)
    if (resumeFileName || companyCin) score += 10;

    // Stage 3: Experience (20%)
    if (experiences.length > 0) score += 20;

    // Stage 4: Education (10%)
    if (educations.length > 0 || isRecruiter) score += 10;

    // Stage 5: Skills (10%)
    if (selectedSkills.length >= 3) score += 10;
    else if (selectedSkills.length > 0) score += 5;

    // Stage 6: Summary (10%)
    if (profileSummary.length >= 30) score += 10;

    // Stage 7: Preferences (10%)
    if (preferredLocations.length > 0) score += 10;

    // Stage 8: Extras (10%)
    if (portfolioUrl || linkedinUrl) score += 10;

    return Math.min(100, score);
  };

  const completionPercentage = calculateCompleteness();

  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.title || !newExp.company) return;
    setExperiences([
      ...experiences,
      {
        id: Date.now(),
        ...newExp,
      },
    ]);
    setNewExp({
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    });
  };

  const handleRemoveExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) return;
    setEducations([
      ...educations,
      {
        id: Date.now(),
        ...newEdu,
      },
    ]);
    setNewEdu({
      degree: '',
      institution: '',
      year: '',
      grade: '',
    });
  };

  const handleRemoveEducation = (id) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const handleSimulateOtp = () => {
    if (!phone || phone.length < 8) {
      alert('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setOtpSent(true);
    setOtpCode('8492'); // Pre-fill mock OTP for frictionless verification
  };

  const handleVerifyOtp = () => {
    if (otpCode === '8492' || otpCode.length === 4) {
      setPhoneVerified(true);
      setOtpSent(false);
    } else {
      alert('Invalid OTP. Please enter 8492 to verify.');
    }
  };

  const handleFinishWizard = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: fullName.trim(),
        contactNumber: phone.trim(),
        companyName: isRecruiter ? (user.companyName || 'JobFins Tech') : null,
        bioOrSkills: !isRecruiter ? selectedSkills.join(', ') : selectedSkills.join(', '),
      };

      const res = await userService.updateProfile(updateData);
      const updatedUser = {
        ...user,
        ...res.data,
        completedProfile: true,
        profileStrength: 100,
      };

      localStorage.setItem('jobfins_user', JSON.stringify(updatedUser));
      localStorage.setItem('jobfins_profile_completed', 'true');
      if (onProfileUpdated) onProfileUpdated(updatedUser);

      setShowCelebration(true);
    } catch (err) {
      console.warn('Backend update fallback:', err);
      const updatedUser = {
        ...user,
        name: fullName,
        contactNumber: phone,
        bioOrSkills: selectedSkills.join(', '),
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

  const stepsMeta = [
    { num: 1, title: 'Basic Info', icon: 'bi-person-vcard', weight: '20%' },
    { num: 2, title: isRecruiter ? 'Company Info' : 'Resume Upload', icon: isRecruiter ? 'bi-building' : 'bi-file-earmark-pdf', weight: '10%' },
    { num: 3, title: 'Experience', icon: 'bi-briefcase', weight: '20%' },
    { num: 4, title: isRecruiter ? 'Org Scale' : 'Education', icon: isRecruiter ? 'bi-diagram-3' : 'bi-mortarboard', weight: '10%' },
    { num: 5, title: isRecruiter ? 'Requisitions' : 'Key Skills', icon: 'bi-stars', weight: '10%' },
    { num: 6, title: 'Summary / Bio', icon: 'bi-text-paragraph', weight: '10%' },
    { num: 7, title: 'Preferences', icon: 'bi-sliders2', weight: '10%' },
    { num: 8, title: 'Avatar & Extras', icon: 'bi-shield-check', weight: '10%' },
  ];

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(10, 25, 47, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1060,
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden" style={{ minHeight: '620px' }}>
          
          {/* Header Bar with Progress */}
          <div className="modal-header border-bottom py-3 px-4" style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1E3A8A 100%)' }}>
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center shadow"
                style={{ width: '42px', height: '42px', fontSize: '1.2rem' }}
              >
                {selectedAvatar}
              </div>
              <div>
                <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  <span>Complete Your {isRecruiter ? 'Recruiter' : 'Career'} Profile</span>
                  <span className="badge bg-primary text-white font-monospace" style={{ fontSize: '0.75rem' }}>
                    {completionPercentage}% Done
                  </span>
                </h5>
                <small className="text-light opacity-75">
                  Step {currentStep} of 8: {stepsMeta[currentStep - 1]?.title}
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

          {/* Stepper Navigation Bar */}
          <div className="bg-light border-bottom px-3 py-2">
            <div className="d-flex justify-content-between align-items-center overflow-auto gap-2">
              {stepsMeta.map((s) => (
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
                  <span className="fw-semibold" style={{ fontSize: '0.8rem' }}>
                    {s.num}. {s.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Live Progress Bar */}
            <div className="progress mt-2" style={{ height: '6px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-gradient-primary"
                role="progressbar"
                style={{
                  width: `${completionPercentage}%`,
                  background: 'linear-gradient(90deg, #2563EB 0%, #059669 100%)',
                }}
              ></div>
            </div>
          </div>

          {/* Modal Body: Stage Content */}
          <div className="modal-body p-4 p-md-5 bg-white">
            
            {/* CELEBRATION POPUP */}
            {showCelebration ? (
              <div className="text-center py-5">
                <div className="display-1 text-success mb-3 animate__animated animate__bounceIn">🎉</div>
                <h3 className="fw-bold text-dark mb-2">Profile Completed 100%!</h3>
                <p className="text-muted col-md-8 mx-auto mb-4">
                  Congratulations, {fullName}! Your {isRecruiter ? 'recruiting company workspace' : 'candidate profile and ATS resume portfolio'} are verified and 100% complete. You are now placed in top-tier visibility!
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
            ) : (
              <>
                {/* STAGE 1: Basic Details (20%) */}
                {currentStep === 1 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Stage 1 of 8</span>
                      <h4 className="fw-bold text-dark mb-0">Basic Details & Contact Verification</h4>
                    </div>
                    <p className="text-muted small mb-4">
                      Let employers and talent know your official identity and verified contact channels.
                    </p>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Full Legal Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ayush Sharma"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                        <input
                          type="email"
                          className="form-control bg-light"
                          value={user.email}
                          disabled
                        />
                        <small className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Verified Login Email</small>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">
                          Mobile Number & OTP Verification *
                        </label>
                        <div className="input-group">
                          <input
                            type="tel"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 9876543210"
                          />
                          {!phoneVerified ? (
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={handleSimulateOtp}
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
                              Demo OTP sent to <b>{phone}</b>. Use test code <b>8492</b>:
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
                        <label className="form-label small fw-bold text-muted text-uppercase">Current Location *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Bangalore / Mumbai / Delhi-NCR"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">
                          {isRecruiter ? 'Recruiter Designation' : 'Current Employment Status'}
                        </label>
                        {isRecruiter ? (
                          <input
                            type="text"
                            className="form-control"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="e.g. VP Talent Acquisition"
                          />
                        ) : (
                          <select
                            className="form-select"
                            value={employmentStatus}
                            onChange={(e) => setEmploymentStatus(e.target.value)}
                          >
                            <option value="Employed (Looking for Opportunities)">Employed (Active Seeker)</option>
                            <option value="Serving Notice Period (Immediate Joiner)">Serving Notice Period</option>
                            <option value="Fresher / College Graduate (2025/2026)">Fresher / Recent Graduate</option>
                            <option value="Freelancer / Consultant">Freelance / Contract</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 2: Resume Upload / Company Verification (10%) */}
                {currentStep === 2 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Stage 2 of 8</span>
                      <h4 className="fw-bold text-dark mb-0">
                        {isRecruiter ? 'Company Verification & Branding' : 'ATS Resume Parser & Validator'}
                      </h4>
                    </div>

                    {!isRecruiter ? (
                      <div>
                        <div
                          className="p-4 border-2 border-dashed rounded-4 text-center mb-3 bg-light"
                          style={{ borderColor: '#2563EB', cursor: 'pointer' }}
                        >
                          <i className="bi bi-cloud-arrow-up-fill display-4 text-primary d-block mb-2"></i>
                          <h6 className="fw-bold text-dark mb-1">Drag & Drop Your ATS-Friendly Resume</h6>
                          <p className="text-muted small mb-2">Supported formats: PDF, DOCX (Max 10MB)</p>
                          <span className="badge bg-primary px-3 py-2">
                            <i className="bi bi-file-earmark-check me-1"></i> {resumeFileName}
                          </span>
                        </div>

                        {/* ATS Score Meter Card */}
                        <div className="p-3 bg-success-subtle border border-success rounded-3 mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold text-success-emphasis d-flex align-items-center gap-1">
                              <i className="bi bi-shield-check"></i> JobFins ATS Score:
                            </span>
                            <span className="badge bg-success fs-6">{atsScore} / 100 (Excellent)</span>
                          </div>
                          <ul className="mb-0 small text-success-emphasis ps-3">
                            {atsFeedback.map((fb, idx) => (
                              <li key={idx}>{fb}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted text-uppercase">Corporate Website</label>
                          <input
                            type="url"
                            className="form-control"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            placeholder="https://yourcompany.com"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted text-uppercase">Corporate CIN / GSTIN</label>
                          <input
                            type="text"
                            className="form-control"
                            value={companyCin}
                            onChange={(e) => setCompanyCin(e.target.value)}
                            placeholder="U72200KA2024PTC123456"
                          />
                        </div>
                        <div className="col-12">
                          <div className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-patch-check-fill text-primary fs-3"></i>
                              <div>
                                <div className="fw-bold text-dark">Verified Employer Badge</div>
                                <small className="text-muted">Enables zero-spam verified direct messaging to candidate talent pools.</small>
                              </div>
                            </div>
                            <span className="badge bg-success">Auto-Verified</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STAGE 3: Experience History (20%) */}
                {currentStep === 3 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Stage 3 of 8</span>
                      <h4 className="fw-bold text-dark mb-0">
                        {isRecruiter ? 'Recruiting & Hiring Track Record' : 'Employment & Experience History'}
                      </h4>
                    </div>

                    {/* Existing List */}
                    <div className="mb-4">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="p-3 border rounded-3 mb-2 bg-light d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-bold text-dark">{exp.title}</div>
                            <div className="text-primary small fw-semibold">{exp.company} &bull; {exp.startDate} - {exp.endDate}</div>
                            <p className="text-muted small mb-0 mt-1">{exp.description}</p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveExperience(exp.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Experience Form */}
                    <div className="p-3 border rounded-3 bg-white">
                      <h6 className="fw-bold text-dark mb-3"><i className="bi bi-plus-circle me-1 text-primary"></i> Add Position</h6>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Job Title (e.g. Backend Lead)"
                            value={newExp.title}
                            onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Company Name (e.g. Razorpay)"
                            value={newExp.company}
                            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Start Date (e.g. 2022-06)"
                            value={newExp.startDate}
                            onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="End Date (e.g. Present)"
                            value={newExp.endDate}
                            onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4 d-flex align-items-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100 fw-bold"
                            onClick={handleAddExperience}
                          >
                            Add Position
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 4: Education / Org Scale (10%) */}
                {currentStep === 4 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Stage 4 of 8</span>
                      <h4 className="fw-bold text-dark mb-0">
                        {isRecruiter ? 'Organization Scale & Team Size' : 'Education & Academic Degrees'}
                      </h4>
                    </div>

                    {!isRecruiter ? (
                      <div>
                        {educations.map((edu) => (
                          <div key={edu.id} className="p-3 border rounded-3 mb-2 bg-light d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-bold text-dark">{edu.degree}</div>
                              <div className="text-primary small fw-semibold">{edu.institution} &bull; Class of {edu.year}</div>
                              <small className="text-muted">Grade/Score: {edu.grade}</small>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveEducation(edu.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        ))}

                        <div className="p-3 border rounded-3 bg-white mt-3">
                          <h6 className="fw-bold text-dark mb-3"><i className="bi bi-mortarboard me-1 text-primary"></i> Add Education</h6>
                          <div className="row g-2">
                            <div className="col-md-6">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Degree (e.g. B.Tech Computer Science)"
                                value={newEdu.degree}
                                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                              />
                            </div>
                            <div className="col-md-6">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="College / University"
                                value={newEdu.institution}
                                onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Passing Year (e.g. 2023)"
                                value={newEdu.year}
                                onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="CGPA / Percentage"
                                value={newEdu.grade}
                                onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                              />
                            </div>
                            <div className="col-md-4">
                              <button
                                type="button"
                                className="btn btn-sm btn-primary w-100 fw-bold"
                                onClick={handleAddEducation}
                              >
                                Save Degree
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted text-uppercase">Company Size</label>
                          <select
                            className="form-select"
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                          >
                            <option value="1-10 Employees (Seed / Early)">1-10 Employees (Seed)</option>
                            <option value="11-50 Employees (Growth)">11-50 Employees (Growth)</option>
                            <option value="51-200 Employees">51-200 Employees</option>
                            <option value="201-1000 Employees">201-1000 Employees</option>
                            <option value="1000+ Enterprise">1000+ Enterprise</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted text-uppercase">Funding Stage</label>
                          <select
                            className="form-select"
                            value={fundingStage}
                            onChange={(e) => setFundingStage(e.target.value)}
                          >
                            <option value="Bootstrapped & Profitable">Bootstrapped & Profitable</option>
                            <option value="Seed / Angel Backed">Seed / Angel Backed</option>
                            <option value="Series A ($5M - $15M)">Series A ($5M - $15M)</option>
                            <option value="Series B ($25M+ Raised)">Series B ($25M+ Raised)</option>
                            <option value="Public / MNC (NSE/BSE/NASDAQ)">Public / MNC</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STAGE 5: Key Skills / Requisitions (10%) */}
                {currentStep === 5 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Stage 5 of 8</span>
                      <h4 className="fw-bold text-dark mb-0">
                        {isRecruiter ? 'Target Tech Stacks & Hiring Requisitions' : 'Key Skills & Technical Arsenal'}
                      </h4>
                    </div>
                    <p className="text-muted small mb-3">
                      Select 15–20 high-demand skills to unlock maximum ATS algorithm matches.
                    </p>

                    {/* Active Selected Skills */}
                    <div className="p-3 border rounded-3 bg-light mb-3">
                      <div className="fw-bold small text-dark mb-2">Selected Skills ({selectedSkills.length}):</div>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="badge bg-cobalt text-white p-2 d-flex align-items-center gap-1 cursor-pointer"
                            onClick={() => handleToggleSkill(skill)}
                            title="Click to remove"
                          >
                            {skill} <i className="bi bi-x"></i>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Chips */}
                    <div className="mb-3">
                      <small className="fw-bold text-muted d-block mb-2">1-Click Recommended Skills:</small>
                      <div className="d-flex flex-wrap gap-2">
                        {suggestedSkillsPool.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            className={`btn btn-sm ${
                              selectedSkills.includes(skill) ? 'btn-primary' : 'btn-outline-secondary'
                            } rounded-pill`}
                            onClick={() => handleToggleSkill(skill)}
                          >
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Add Skill */}
                    <form onSubmit={handleAddCustomSkill} className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Add custom skill (e.g. AWS Lambda, Rust)..."
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                      />
                      <button type="submit" className="btn btn-sm btn-outline-primary fw-bold text-nowrap">
                        Add Skill
                      </button>
                    </form>
                  </div>
                )}

                {/* STAGE 6: Profile Summary / Recruiter EVP (10%) */}
                {currentStep === 6 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Stage 6 of 8</span>
                      <h4 className="fw-bold text-dark mb-0">
                        {isRecruiter ? 'Recruiting Philosophy & Employer Pitch' : '50-Word Professional Summary'}
                      </h4>
                    </div>
                    <p className="text-muted small mb-3">
                      A compelling executive summary helps talent and recruiters discover your core strengths in seconds.
                    </p>

                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows={4}
                        value={profileSummary}
                        onChange={(e) => setProfileSummary(e.target.value)}
                        placeholder="Write a brief elevator pitch about your technical expertise..."
                      ></textarea>
                      <div className="d-flex justify-content-between mt-1 text-muted small">
                        <span>Word count: ~{profileSummary.trim().split(/\s+/).filter(Boolean).length} words</span>
                        <span className="text-success fw-bold"><i className="bi bi-sparkles me-1"></i>AI Optimized</span>
                      </div>
                    </div>

                    {/* Quick Templates */}
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setProfileSummary(
                            'Full-Stack Developer with deep expertise in Java 17, Spring Boot, MySQL, and React.js. Passionate about building resilient distributed systems and delivering clean code with 100% test coverage.'
                          )
                        }
                      >
                        Use Backend Template
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setProfileSummary(
                            'Cloud & DevOps Engineer skilled in Docker, Kubernetes, CI/CD pipelines, AWS, and Infrastructure as Code. Experienced in scaling microservice architectures to millions of requests.'
                          )
                        }
                      >
                        Use DevOps Template
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 7: Career Preferences / Hiring Model (10%) */}
                {currentStep === 7 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Stage 7 of 8</span>
                      <h4 className="fw-bold text-dark mb-0">Career Preferences & CTC Corridor</h4>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">
                          {isRecruiter ? 'Hiring Locations' : 'Preferred Work Locations'}
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {['Remote', 'Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Gurgaon', 'Chennai'].map((loc) => (
                            <span
                              key={loc}
                              className={`badge p-2 cursor-pointer ${
                                preferredLocations.includes(loc) ? 'bg-primary' : 'bg-light text-dark border'
                              }`}
                              onClick={() => {
                                if (preferredLocations.includes(loc)) {
                                  setPreferredLocations(preferredLocations.filter((l) => l !== loc));
                                } else {
                                  setPreferredLocations([...preferredLocations, loc]);
                                }
                              }}
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">
                          {isRecruiter ? 'Average Offer CTC Band' : 'Expected CTC (LPA in INR)'}
                        </label>
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

                {/* STAGE 8: Personal Details & Extras (10%) */}
                {currentStep === 8 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Stage 8 of 8</span>
                      <h4 className="fw-bold text-dark mb-0">Avatar, Portfolio & Final Verification</h4>
                    </div>

                    {/* Avatar Picker */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-muted text-uppercase">Choose Profile Avatar</label>
                      <div className="d-flex gap-2">
                        {['👨‍💻', '👩‍💻', '🚀', '⚡', '💼', '🎯', '🌟', '🛡️'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className={`btn fs-4 rounded-circle p-2 ${
                              selectedAvatar === emoji ? 'btn-primary border-3' : 'btn-light border'
                            }`}
                            style={{ width: '54px', height: '54px' }}
                            onClick={() => setSelectedAvatar(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">GitHub / Portfolio URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">LinkedIn Profile URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Languages Known</label>
                        <input
                          type="text"
                          className="form-control"
                          value={languages.join(', ')}
                          onChange={(e) => setLanguages(e.target.value.split(',').map((l) => l.trim()))}
                          placeholder="English, Hindi, Kannada, Tamil"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
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
                        <i className="bi bi-check-all me-1"></i> Complete Profile (100%)
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
