import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Attach Cognito ID token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// Projects API
export const projectsApi = {
  list: () => api.get('/api/v1/projects'),
  create: (data) => api.post('/api/v1/projects', data),
  get: (id) => api.get(`/api/v1/projects/${id}`),
  updateQuestions: (id, data) => api.put(`/api/v1/projects/${id}/questions`, data),
  generate: (id) => api.post(`/api/v1/projects/${id}/generate`),
  delete: (id) => api.delete(`/api/v1/projects/${id}`),
}

// Architectures API
export const architecturesApi = {
  getByProject: (projectId) => api.get(`/api/v1/architectures/project/${projectId}`),
}

export default api
