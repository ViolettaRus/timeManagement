import api from './api';

export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  updateUser: (userData) => api.put('/auth/update', userData),
  logout: () => api.post('/auth/logout'),
};