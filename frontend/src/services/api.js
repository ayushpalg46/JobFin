import axios from 'axios';

// Base API URL for Spring Boot backend (Experiment 4, 5, 6)
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT Bearer token if present (Experiment 6 & Milestone 7)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobfins_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
};

export const jobService = {
  getAllJobs: (keyword = '') => api.get(`/jobs${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
};

export const applicationService = {
  applyForJob: (jobId, applicationData) => api.post(`/applications/apply/${jobId}`, applicationData),
  getMyApplications: () => api.get('/applications/my-applications'),
  getApplicantsForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  getAllApplicantsForRecruiter: () => api.get('/applications/recruiter/all'),
  updateStatus: (applicationId, status) => api.put(`/applications/${applicationId}/status`, { status }),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

export const labService = {
  getDashboardStats: () => api.get('/dashboard/stats'),
  getRecentTransactions: () => api.get('/transactions/recent'),
  getDbAccounts: () => api.get('/db/accounts'),
  createDbAccount: (accountData) => api.post('/db/accounts', accountData),
};

export default api;
