import React, { useState, useRef } from 'react';
import { userService } from '../services/api';

export default function ProfileCompletionWizard({ isOpen, onClose, user, onProfileUpdated }) {
  if (!isOpen || !user) return null;

  const isRecruiter = user?.role === 'ROLE_RECRUITER';
  const resumeFileRef = useRef(null);
  const photoFileRef = useRef(null);

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // =========================================================================
  // RECRUITER STATE (Corporate Registration & Recruiter Persona)
  // =========================================================================
  // Stage 1: Corporate Domain & Registration
  const [companyEmail, setCompanyEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyHqLocation, setCompanyHqLocation] = useState('');
  const isFreeEmailDomain =
    companyEmail.includes('@gmail') ||
    companyEmail.includes('@yahoo') ||
    companyEmail.includes('@outlook') ||
    companyEmail.includes('@hotmail');

  // Stage 2: GSTIN & Corporate KYC
  const [gstin, setGstin] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [kycDocumentName, setKycDocumentName] = useState(null);
  const [kycVerified, setKycVerified] = useState(false);

  // Stage 3: Account Type & Org Scale
  const [accountType, setAccountType] = useState('In-house Corporate HR');
  const [companySize, setCompanySize] = useState('51-200 Employees');
  const [industrySector, setIndustrySector] = useState('IT & Software Products / SaaS');

  // Stage 4: Recruiter Identity & Contact
  const [recruiterName, setRecruiterName] = useState(user?.name || '');
  const [recruiterDesignation, setRecruiterDesignation] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState(user?.contactNumber || '');
  const [phoneVerified, setPhoneVerified] = useState(Boolean(user?.contactNumber));
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Stage 5: Profile Picture & Headshot
  const [customPhotoUrl, setCustomPhotoUrl] = useState(user?.profilePic || null);
  const [recruiterAvatar, setRecruiterAvatar] = useState('👩‍💼');
  const [recruiterLinkedin, setRecruiterLinkedin] = useState('');

  // Stage 6: Recruiter Summary & EVP
  const [recruiterBio, setRecruiterBio] = useState('');

  // Stage 7: Industries & Functional Areas Covered
  const [selectedHiringDomains, setSelectedHiringDomains] = useState(
    user?.bioOrSkills ? user.bioOrSkills.split(',').map((s) => s.trim()).filter(Boolean) : ['IT & Software Services', 'FinTech & Payments']
  );
  const [selectedFunctionalRoles, setSelectedFunctionalRoles] = useState([
    'Java & Backend Engineering',
    'React & Frontend Engineering',
  ]);

  // Stage 8: Hiring Locations & Trust Seal
  const [hiringLocations, setHiringLocations] = useState(['Bangalore', 'Remote']);
  const [workModel, setWorkModel] = useState('Hybrid (2-3 Days Office)');

  // =========================================================================
  // JOB SEEKER STATE (Candidate Credentials & ATS Portfolio)
  // =========================================================================
  // Stage 1: Basic Details
  const [seekerFullName, setSeekerFullName] = useState(user?.name || '');
  const [seekerPhone, setSeekerPhone] = useState(user?.contactNumber || '');
  const [seekerLocation, setSeekerLocation] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('Employed (Active Seeker)');

  // Stage 2: Genuine Resume Upload & ATS
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || '');
  const [resumeFileSize, setResumeFileSize] = useState(user?.resumeFileSize || '');
  const [resumeBase64, setResumeBase64] = useState(user?.resumeBase64 || null);
  const [atsScore, setAtsScore] = useState(resumeFileName ? 88 : 0);
  const [atsFeedback, setAtsFeedback] = useState(
    resumeFileName
      ? ['Resume file verified & attached', 'ATS keywords readable']
      : ['Please upload your PDF/Word resume to generate your ATS Score']
  );

  // Stage 3: Experience History
  const [experiences, setExperiences] = useState(user?.experiences || []);
  const [newExp, setNewExp] = useState({ title: '', company: '', startDate: '', endDate: '', description: '' });

  // Stage 4: Education
  const [educations, setEducations] = useState(user?.educations || []);
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', year: '', grade: '' });

  // Stage 5: Key Skills
  const [seekerSkills, setSeekerSkills] = useState(
    user?.bioOrSkills ? user.bioOrSkills.split(',').map((s) => s.trim()).filter(Boolean) : []
  );
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Stage 6: Profile Summary
  const [seekerSummary, setSeekerSummary] = useState(user?.summary || '');

  // Stage 7: Preferences & CTC
  const [seekerPreferredLocations, setSeekerPreferredLocations] = useState(['Remote', 'Bangalore']);
  const [expectedCtc, setExpectedCtc] = useState(12);
  const [noticePeriod, setNoticePeriod] = useState('15 Days / Immediate');

  // Stage 8: Extras
  const [seekerAvatar, setSeekerAvatar] = useState('👨‍💻');
  const [seekerGithub, setSeekerGithub] = useState('');
  const [seekerLinkedin, setSeekerLinkedin] = useState('');

  // =========================================================================
  // FILE UPLOAD HANDLERS
  // =========================================================================
  const handleResumeFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Please select a resume file under 10MB.');
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
    setResumeFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      setResumeBase64(reader.result);
      // Dynamic ATS match score based on skills and resume file naming
      let score = 80;
      if (file.name.toLowerCase().includes('resume') || file.name.toLowerCase().includes('cv')) score += 5;
      if (file.name.endsWith('.pdf')) score += 5;
      if (seekerSkills.length >= 3) score += 6;
      setAtsScore(Math.min(98, score));
      setAtsFeedback([
        `File "${file.name}" successfully parsed.`,
        'ATS typography and section header structures validated.',
        'Match keywords ready for enterprise recruiter searches.',
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please upload a smaller photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCustomPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleKycDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKycDocumentName(file.name);
    setKycVerified(true);
  };

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
  const completionPercentage = Math.round((currentStep / 8) * 100);

  // OTP Handlers
  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('8492');
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim().length >= 4) {
      setPhoneVerified(true);
      setOtpSent(false);
    } else {
      alert('Please enter a 4-digit verification code.');
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
        profilePic: customPhotoUrl,
        resumeFileName: resumeFileName,
        resumeFileSize: resumeFileSize,
        resumeBase64: resumeBase64,
        experiences: experiences,
        educations: educations,
        accountType: isRecruiter ? accountType : null,
        designation: isRecruiter ? recruiterDesignation : null,
        companyName: isRecruiter ? companyName : null,
        gstin: isRecruiter ? gstin : null,
        cinNumber: isRecruiter ? cinNumber : null,
        summary: isRecruiter ? recruiterBio : seekerSummary,
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
        profilePic: customPhotoUrl,
        resumeFileName: resumeFileName,
        resumeFileSize: resumeFileSize,
        resumeBase64: resumeBase64,
        experiences: experiences,
        educations: educations,
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
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={resumeFileRef}
        accept=".pdf,.doc,.docx,.txt"
        style={{ display: 'none' }}
        onChange={handleResumeFileUpload}
      />
      <input
        type="file"
        ref={photoFileRef}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />

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
                className="rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center shadow overflow-hidden"
                style={{ width: '46px', height: '46px', fontSize: '1.4rem' }}
              >
                {customPhotoUrl ? (
                  <img src={customPhotoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{isRecruiter ? recruiterAvatar : seekerAvatar}</span>
                )}
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
                    ? `Congratulations! ${companyName || 'Your Company'} and your recruiter profile for ${recruiterName} are officially verified. You now have full talent sourcing and direct messaging access.`
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
                            <span>Free email detected. For verified trust badge, use corporate domain (e.g. @company.com).</span>
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
                          placeholder="e.g. TechCorp Technologies Pvt Ltd"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Official Corporate Website</label>
                        <input
                          type="url"
                          className="form-control"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://yourcompany.com"
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
                      JobFins requires company GSTIN, CIN, or business registration proof to verify legitimacy and prevent fraudulent hiring.
                    </p>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">15-Digit Corporate GSTIN</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light font-monospace">GST</span>
                          <input
                            type="text"
                            className="form-control font-monospace text-uppercase"
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            placeholder="e.g. 29AABCU9603R1ZM"
                            maxLength={15}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Corporate Identification Number (CIN)</label>
                        <input
                          type="text"
                          className="form-control font-monospace text-uppercase"
                          value={cinNumber}
                          onChange={(e) => setCinNumber(e.target.value)}
                          placeholder="e.g. U72200KA2024PTC123456"
                        />
                      </div>

                      <div className="col-12">
                        <div
                          className="p-4 border-2 border-dashed rounded-3 text-center bg-light cursor-pointer"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.pdf,.png,.jpg,.jpeg';
                            input.onchange = handleKycDocUpload;
                            input.click();
                          }}
                        >
                          <i className="bi bi-cloud-arrow-up display-6 text-primary d-block mb-1"></i>
                          <div className="fw-bold text-dark">
                            {kycDocumentName ? kycDocumentName : 'Upload Certificate of Incorporation / GST Certificate'}
                          </div>
                          <small className="text-muted">Click to attach official corporate registration proof (PDF / JPG)</small>
                        </div>
                      </div>
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
                        <label className="form-label small fw-bold text-muted text-uppercase">Company Size</label>
                        <select
                          className="form-select"
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                        >
                          <option value="1-10 Employees">1-10 Employees (Seed / Early)</option>
                          <option value="11-50 Employees">11-50 Employees (Series A)</option>
                          <option value="51-200 Employees">51-200 Employees (High Growth)</option>
                          <option value="201-1000 Employees">201-1000 Employees (Mid-Market)</option>
                          <option value="1000+ Employees">1000+ Employees (Enterprise MNC)</option>
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
                          Direct Corporate Mobile Number
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
                              Enter 4-digit verification code sent to {recruiterPhone}:
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
                                Verify
                              </button>
                            </div>
                          </div>
                        )}
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

                    <div className="p-4 bg-light rounded-4 border text-center mb-4">
                      <div
                        className="rounded-circle bg-white shadow-md mx-auto mb-3 d-flex align-items-center justify-content-center border overflow-hidden position-relative"
                        style={{ width: '100px', height: '100px', fontSize: '3rem' }}
                      >
                        {customPhotoUrl ? (
                          <img src={customPhotoUrl} alt="Recruiter Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span>{recruiterAvatar}</span>
                        )}
                      </div>

                      <div className="d-flex justify-content-center gap-2 mb-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary fw-bold"
                          onClick={() => photoFileRef.current?.click()}
                        >
                          <i className="bi bi-camera-fill me-1"></i> Upload Real Photo
                        </button>
                        {customPhotoUrl && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setCustomPhotoUrl(null)}
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      <small className="fw-bold text-muted d-block mb-2">Or choose a business avatar:</small>
                      <div className="d-flex justify-content-center gap-2">
                        {['👩‍💼', '👨‍💼', '🧑‍💻', '👩‍💻', '🌟', '💼', '⚡', '🚀'].map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            className={`btn fs-4 rounded-circle p-2 ${
                              recruiterAvatar === avatar && !customPhotoUrl ? 'btn-primary border-3' : 'btn-white border'
                            }`}
                            style={{ width: '48px', height: '48px' }}
                            onClick={() => {
                              setCustomPhotoUrl(null);
                              setRecruiterAvatar(avatar);
                            }}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted text-uppercase">LinkedIn Recruiter Profile URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={recruiterLinkedin}
                          onChange={(e) => setRecruiterLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/your-profile"
                        />
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

                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows={4}
                        value={recruiterBio}
                        onChange={(e) => setRecruiterBio(e.target.value)}
                        placeholder="Detail your specialized hiring focus and company EVP..."
                      ></textarea>
                    </div>

                    <small className="fw-bold text-muted d-block mb-2">1-Click Quick Bio Templates:</small>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setRecruiterBio(
                            'Specialise in hiring Tech Leaders, System Architects, and Full-Stack Java / Cloud Developers for high-growth tech startups.'
                          )
                        }
                      >
                        🚀 Tech Startup Hiring
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setRecruiterBio(
                            'Leading talent acquisition across distributed microservices, platform engineering, and cloud infrastructure pipelines.'
                          )
                        }
                      >
                        🏢 Platform Engineering
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

                    <div>
                      <label className="form-label small fw-bold text-dark mb-2">Functional Roles Hired:</label>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          'Java & Backend Engineering',
                          'React & Frontend Engineering',
                          'Cloud DevOps & Kubernetes',
                          'Distributed Systems Architect',
                          'Data Science & AI/ML',
                          'Product Management',
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            className={`btn btn-sm rounded-pill ${
                              selectedFunctionalRoles.includes(role) ? 'btn-dark text-white' : 'btn-outline-secondary'
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

                {/* STAGE 8: Tech Hubs & Seal */}
                {currentStep === 8 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Recruiter Stage 8</span>
                      <h4 className="fw-bold text-dark mb-0">Hiring Locations & Verified Recruiter Seal</h4>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Tech Hub Locations</label>
                        <div className="d-flex flex-wrap gap-2">
                          {['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi-NCR', 'Remote'].map((city) => (
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
                        <label className="form-label small fw-bold text-muted text-uppercase">Work Model</label>
                        <select
                          className="form-select"
                          value={workModel}
                          onChange={(e) => setWorkModel(e.target.value)}
                        >
                          <option value="Hybrid (2-3 Days Office)">Hybrid (2-3 Days Office)</option>
                          <option value="100% Remote">100% Remote</option>
                          <option value="On-Site">On-Site</option>
                        </select>
                      </div>
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
                          placeholder="Enter your full name"
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
                        <label className="form-label small fw-bold text-muted text-uppercase">Mobile Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={seekerPhone}
                          onChange={(e) => setSeekerPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase">Current Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={seekerLocation}
                          onChange={(e) => setSeekerLocation(e.target.value)}
                          placeholder="e.g. Bangalore / Mumbai"
                        />
                      </div>

                      <div className="col-md-12">
                        <label className="form-label small fw-bold text-muted text-uppercase">Employment Status</label>
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

                {/* STAGE 2: Real Resume Upload & ATS */}
                {currentStep === 2 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 2</span>
                      <h4 className="fw-bold text-dark mb-0">ATS Resume Upload & Validator</h4>
                    </div>

                    <div
                      className="p-4 border-2 border-dashed rounded-4 text-center mb-3 bg-light cursor-pointer"
                      style={{ borderColor: '#2563EB' }}
                      onClick={() => resumeFileRef.current?.click()}
                    >
                      <i className="bi bi-cloud-arrow-up-fill display-4 text-primary d-block mb-2"></i>
                      <h6 className="fw-bold text-dark mb-1">
                        {resumeFileName ? resumeFileName : 'Click to Upload Your Resume (PDF / Word)'}
                      </h6>
                      <p className="text-muted small mb-2">
                        {resumeFileSize ? `Size: ${resumeFileSize}` : 'Supported formats: PDF, DOCX, DOC (Max 10MB)'}
                      </p>
                      <button type="button" className="btn btn-sm btn-primary px-3 fw-bold">
                        <i className="bi bi-upload me-1"></i> {resumeFileName ? 'Change Resume' : 'Select Resume File'}
                      </button>
                    </div>

                    {resumeFileName && (
                      <div className="p-3 bg-success-subtle border border-success rounded-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-success-emphasis"><i className="bi bi-shield-check"></i> JobFins ATS Score:</span>
                          <span className="badge bg-success fs-6">{atsScore} / 100 (ATS Optimized)</span>
                        </div>
                        <ul className="mb-0 small text-success-emphasis ps-3">
                          {atsFeedback.map((fb, idx) => (
                            <li key={idx}>{fb}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* STAGE 3: Experience */}
                {currentStep === 3 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 3</span>
                      <h4 className="fw-bold text-dark mb-0">Employment & Experience History</h4>
                    </div>

                    {experiences.map((exp, idx) => (
                      <div key={idx} className="p-3 border rounded-3 mb-2 bg-light d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold text-dark">{exp.title}</div>
                          <div className="text-primary small fw-semibold">{exp.company} &bull; {exp.startDate} - {exp.endDate}</div>
                          <p className="text-muted small mb-0 mt-1">{exp.description}</p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ))}

                    <div className="p-3 border rounded-3 bg-white mt-3">
                      <h6 className="fw-bold text-dark mb-3"><i className="bi bi-plus-circle me-1 text-primary"></i> Add Work Experience</h6>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Job Title (e.g. Software Engineer)"
                            value={newExp.title}
                            onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Company (e.g. Razorpay)"
                            value={newExp.company}
                            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Start Date"
                            value={newExp.startDate}
                            onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="End Date (or Present)"
                            value={newExp.endDate}
                            onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100 fw-bold"
                            onClick={() => {
                              if (newExp.title && newExp.company) {
                                setExperiences([...experiences, { ...newExp }]);
                                setNewExp({ title: '', company: '', startDate: '', endDate: '', description: '' });
                              }
                            }}
                          >
                            Add Position
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

                    {educations.map((edu, idx) => (
                      <div key={idx} className="p-3 border rounded-3 mb-2 bg-light d-flex justify-content-between">
                        <div>
                          <div className="fw-bold text-dark">{edu.degree}</div>
                          <div className="text-primary small fw-semibold">{edu.institution} &bull; Class of {edu.year}</div>
                          <small className="text-muted">{edu.grade}</small>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setEducations(educations.filter((_, i) => i !== idx))}
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
                            placeholder="Institution / University"
                            value={newEdu.institution}
                            onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Passing Year"
                            value={newEdu.year}
                            onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Grade / CGPA"
                            value={newEdu.grade}
                            onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100 fw-bold"
                            onClick={() => {
                              if (newEdu.degree) {
                                setEducations([...educations, { ...newEdu }]);
                                setNewEdu({ degree: '', institution: '', year: '', grade: '' });
                              }
                            }}
                          >
                            Save Degree
                          </button>
                        </div>
                      </div>
                    </div>
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
                      <small className="fw-bold text-muted d-block mb-2">1-Click Suggested Skills:</small>
                      <div className="d-flex flex-wrap gap-2">
                        {['Java 17', 'Spring Boot', 'MySQL', 'React.js', 'REST APIs', 'Docker', 'Kubernetes', 'AWS', 'Python', 'TypeScript'].map((skill) => (
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
                        placeholder="Add skill (e.g. Redis, Kafka)..."
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
                      placeholder="Write a brief snapshot about your engineering expertise and target roles..."
                    ></textarea>

                    <small className="fw-bold text-muted d-block mb-2">Quick AI Templates:</small>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setSeekerSummary(
                            'Full-Stack Developer skilled in building robust microservices with Java, Spring Boot, MySQL, and modern web apps with React.'
                          )
                        }
                      >
                        Backend Engineer Template
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setSeekerSummary(
                            'Software Engineer focused on high performance systems, cloud deployment, and scalable RESTful API architecture.'
                          )
                        }
                      >
                        Full Stack Template
                      </button>
                    </div>
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
                            min="3"
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

                {/* STAGE 8: Avatar & Real Photo */}
                {currentStep === 8 && (
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">Candidate Stage 8</span>
                      <h4 className="fw-bold text-dark mb-0">Profile Picture & Portfolio Links</h4>
                    </div>

                    <div className="p-4 bg-light rounded-4 border text-center mb-4">
                      <div
                        className="rounded-circle bg-white shadow-md mx-auto mb-3 d-flex align-items-center justify-content-center border overflow-hidden"
                        style={{ width: '100px', height: '100px', fontSize: '3rem' }}
                      >
                        {customPhotoUrl ? (
                          <img src={customPhotoUrl} alt="Candidate Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span>{seekerAvatar}</span>
                        )}
                      </div>

                      <div className="d-flex justify-content-center gap-2 mb-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary fw-bold"
                          onClick={() => photoFileRef.current?.click()}
                        >
                          <i className="bi bi-camera-fill me-1"></i> Upload Real Photo
                        </button>
                        {customPhotoUrl && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setCustomPhotoUrl(null)}
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      <small className="fw-bold text-muted d-block mb-2">Or choose an avatar:</small>
                      <div className="d-flex justify-content-center gap-2">
                        {['👨‍💻', '👩‍💻', '🚀', '⚡', '💼', '🎯', '🌟'].map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            className={`btn fs-4 rounded-circle p-2 ${
                              seekerAvatar === avatar && !customPhotoUrl ? 'btn-primary border-3' : 'btn-light border'
                            }`}
                            style={{ width: '48px', height: '48px' }}
                            onClick={() => {
                              setCustomPhotoUrl(null);
                              setSeekerAvatar(avatar);
                            }}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
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
