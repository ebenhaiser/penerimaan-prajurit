const API_BASE = '/api/v1';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('prajurit_token') || null;
    this.user = JSON.parse(localStorage.getItem('prajurit_user') || 'null');
  }

  setSession(token, user) {
    this.token = token;
    this.user = user;
    if (token) {
      localStorage.setItem('prajurit_token', token);
      localStorage.setItem('prajurit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('prajurit_token');
      localStorage.removeItem('prajurit_user');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      }
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const res = await fetch(url, config);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = data.message || `HTTP Error ${res.status}`;
        const errorDetails = data.error?.details || [];
        const err = new Error(errorMsg);
        err.details = errorDetails;
        err.code = data.error?.code || 'UNKNOWN_ERROR';
        throw err;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  // Auth
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    this.setSession(res.data.token, res.data.user);
    return res.data;
  }

  async register(email, password, full_name, phone) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: { email, password, full_name, phone }
    });
    this.setSession(res.data.token, res.data.user);
    return res.data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    this.setSession(null, null);
  }

  async getMe() {
    const res = await this.request('/auth/me');
    return res.data;
  }

  // Public Info
  async getPublicInfo() {
    const res = await this.request('/public/info');
    return res.data;
  }

  // Candidate
  async getProfile() {
    const res = await this.request('/candidates/me');
    return res.data;
  }

  async updateProfile(profileData) {
    const res = await this.request('/candidates/me', {
      method: 'PUT',
      body: profileData
    });
    return res.data;
  }

  async getMyApplications() {
    const res = await this.request('/applications/me');
    return res.data;
  }

  async createApplication(data) {
    const res = await this.request('/applications', {
      method: 'POST',
      body: data
    });
    return res.data;
  }

  async getApplication(id) {
    const res = await this.request(`/applications/${id}`);
    return res.data;
  }

  async updateApplication(id, data) {
    const res = await this.request(`/applications/${id}`, {
      method: 'PUT',
      body: data
    });
    return res.data;
  }

  async submitApplication(id) {
    const res = await this.request(`/applications/${id}/submit`, {
      method: 'POST'
    });
    return res.data;
  }

  // Eligibility
  async getEligibility(applicationId) {
    const res = await this.request(`/applications/${applicationId}/eligibility`);
    return res.data;
  }

  async evaluateEligibility(applicationId, pathId = null) {
    const res = await this.request(`/applications/${applicationId}/evaluate-eligibility`, {
      method: 'POST',
      body: { path_id: pathId }
    });
    return res.data;
  }

  // Documents
  async getDocuments(applicationId) {
    const res = await this.request(`/applications/${applicationId}/documents`);
    return res.data;
  }

  async uploadDocument(applicationId, docData) {
    const res = await this.request(`/applications/${applicationId}/documents`, {
      method: 'POST',
      body: docData
    });
    return res.data;
  }

  async deleteDocument(docId) {
    const res = await this.request(`/documents/${docId}`, {
      method: 'DELETE'
    });
    return res.data;
  }

  // Tests
  async getAvailableTests() {
    const res = await this.request('/tests/available');
    return res.data;
  }

  async startAttempt(packageId, applicationId) {
    const res = await this.request(`/tests/${packageId}/attempts`, {
      method: 'POST',
      body: { application_id: applicationId }
    });
    return res.data;
  }

  async getAttempt(attemptId) {
    const res = await this.request(`/attempts/${attemptId}`);
    return res.data;
  }

  async saveAnswer(attemptId, questionId, answer) {
    const res = await this.request(`/attempts/${attemptId}/answers/${questionId}`, {
      method: 'PUT',
      body: { answer }
    });
    return res.data;
  }

  async submitAttempt(attemptId) {
    const res = await this.request(`/attempts/${attemptId}/submit`, {
      method: 'POST'
    });
    return res.data;
  }

  async getTestResult(attemptId) {
    const res = await this.request(`/attempts/${attemptId}/result`);
    return res.data;
  }

  // Recommendation
  async getRecommendation(applicationId) {
    const res = await this.request(`/applications/${applicationId}/recommendation`);
    return res.data;
  }

  async generateRecommendation(applicationId) {
    const res = await this.request(`/applications/${applicationId}/generate-recommendation`, {
      method: 'POST'
    });
    return res.data;
  }

  // Notifications
  async getNotifications() {
    const res = await this.request('/notifications');
    return res.data;
  }

  async markNotificationRead(id) {
    const res = await this.request(`/notifications/${id}/read`, { method: 'PATCH' });
    return res.data;
  }

  async markAllNotificationsRead() {
    const res = await this.request('/notifications/read-all', { method: 'POST' });
    return res.data;
  }

  // Committee & Admin
  async getAdminDashboard() {
    const res = await this.request('/admin/dashboard');
    return res.data;
  }

  async getAdminApplications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await this.request(`/admin/applications?${query}`);
    return res.data;
  }

  async getAdminApplicationDetail(id) {
    const res = await this.request(`/admin/applications/${id}`);
    return res.data;
  }

  async updateAdminApplicationStatus(id, status, notes = '') {
    const res = await this.request(`/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: { status, notes }
    });
    return res.data;
  }

  async verifyDocument(docId, verification_status, review_notes = '') {
    const res = await this.request(`/admin/documents/${docId}/verification`, {
      method: 'PATCH',
      body: { verification_status, review_notes }
    });
    return res.data;
  }

  async reviewRecommendation(recId, review_status, review_notes, recommended_path_id = null) {
    const res = await this.request(`/admin/recommendations/${recId}/review`, {
      method: 'POST',
      body: { review_status, review_notes, recommended_path_id }
    });
    return res.data;
  }

  async getReports() {
    const res = await this.request('/admin/reports');
    return res.data;
  }

  async getAuditLogs(limit = 50) {
    const res = await this.request(`/admin/audit-logs?limit=${limit}`);
    return res.data;
  }

  async getRecruitmentPaths() {
    const res = await this.request('/admin/recruitment-paths');
    return res.data;
  }

  async updateRecruitmentPath(id, pathData) {
    const res = await this.request(`/admin/recruitment-paths/${id}`, {
      method: 'PATCH',
      body: pathData
    });
    return res.data;
  }

  async getTestQuestions() {
    const res = await this.request('/admin/test-questions');
    return res.data;
  }

  async createTestQuestion(questionData) {
    const res = await this.request('/admin/test-questions', {
      method: 'POST',
      body: questionData
    });
    return res.data;
  }
}

export const api = new ApiService();
