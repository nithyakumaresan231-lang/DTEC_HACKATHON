import axios from 'axios';

// Detect Backend API URL from Vite environment variables or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds (especially useful for Gemini API responses)
});

// Request interceptor to automatically attach authorization bearer tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const sentenceService = {
  /**
   * Generates a grammatically correct Tamil sentence
   * @param {Object} payload { subject, verb, object, tense }
   */
  generateSentence: async (payload) => {
    const response = await api.post('/generate-sentence', payload);
    return response.data;
  },

  /**
   * Generates a detailed grammatical explanation card for a sentence inputs
   * @param {Object} payload { subject, verb, object, tense }
   */
  getGrammarExplanation: async (payload) => {
    const response = await api.post('/grammar-explanation', payload);
    return response.data;
  },

  /**
   * Corrects a Tamil sentence for grammatical/spelling errors
   * @param {string} sentence
   */
  correctSpelling: async (sentence) => {
    const response = await api.post('/spell-correct', { sentence });
    return response.data;
  },
};

export const dialogueService = {
  /**
   * Generates dialogue scenarios using Gemini AI
   * @param {Object} payload { scenario, topic, tone, length }
   */
  generateDialogue: async (payload) => {
    const response = await api.post('/generate-dialogue', payload);
    return response.data;
  },
};

export const systemService = {
  /**
   * Checks backend system health status
   */
  checkHealth: async () => {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  },
};

export const authService = {
  /**
   * Register a new user
   */
  signup: async (payload) => {
    const response = await api.post('/auth/signup', payload);
    return response.data;
  },

  /**
   * Login user and get session token
   */
  login: async (payload) => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  /**
   * Log out current user and invalidate token
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current authenticated user details
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;
