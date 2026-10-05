import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  getAll: () => api.get('/todos').then((res) => res.data),
  create: (data) => api.post('/todos', data).then((res) => res.data),
  update: (id, data) => api.put(`/todos/${id}`, data).then((res) => res.data),
  reorder: (ids) => api.put('/todos/reorder', { ids }).then((res) => res.data),
  toggleDone: (id) => api.patch(`/todos/${id}/done`).then((res) => res.data),
  delete: (id) => api.delete(`/todos/${id}`).then((res) => res.data),
};

export default api;
