import api from './api';

export const timeEntriesApi = {
  getTimeEntries: (params = {}) => api.get('/time-entries', { params }),
  createTimeEntry: (entryData) => api.post('/time-entries', entryData),
  updateTimeEntry: (id, entryData) => api.put(`/time-entries/${id}`, entryData),
  deleteTimeEntry: (id) => api.delete(`/time-entries/${id}`),
};