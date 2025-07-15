import { api } from './api'

export async function login(email, password) {
  const response = await api.post('/auth', { email, password });

  const { token } = response.data;
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; secure; samesite=strict`;

  return response.data;
}

export async function verifyToken() {
  const token = localStorage.getItem('token');

  if (!token) throw new Error("Token não encontrado");

  const response = await api.get('/verifytoken', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}