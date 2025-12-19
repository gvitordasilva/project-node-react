import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data)
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getFormadores: () => api.get('/users/formadores'),
  getFormandos: () => api.get('/users/formandos')
};

export const funcaoService = {
  getAll: () => api.get('/funcoes'),
  getById: (id) => api.get(`/funcoes/${id}`),
  create: (data) => api.post('/funcoes', data),
  update: (id, data) => api.put(`/funcoes/${id}`, data),
  delete: (id) => api.delete(`/funcoes/${id}`)
};

export const localService = {
  getAll: () => api.get('/locais'),
  getById: (id) => api.get(`/locais/${id}`),
  create: (data) => api.post('/locais', data),
  update: (id, data) => api.put(`/locais/${id}`, data),
  delete: (id) => api.delete(`/locais/${id}`)
};

export const etapaFormativaService = {
  getAll: () => api.get('/etapas-formativas'),
  getById: (id) => api.get(`/etapas-formativas/${id}`),
  create: (data) => api.post('/etapas-formativas', data),
  update: (id, data) => api.put(`/etapas-formativas/${id}`, data),
  delete: (id) => api.delete(`/etapas-formativas/${id}`)
};

export const documentService = {
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/documents/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/documents/${id}`),
  download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' })
};

export const videoService = {
  getAll: (params) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  create: (formData) => api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/videos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/videos/${id}`)
};

export const acompanhamentoService = {
  getAll: (params) => api.get('/acompanhamentos', { params }),
  getById: (id) => api.get(`/acompanhamentos/${id}`),
  getByFormando: (formandoId) => api.get(`/acompanhamentos/formando/${formandoId}`),
  create: (data) => api.post('/acompanhamentos', data),
  update: (id, data) => api.put(`/acompanhamentos/${id}`, data),
  delete: (id) => api.delete(`/acompanhamentos/${id}`)
};

export default api;
