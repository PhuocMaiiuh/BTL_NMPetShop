const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/users?${query}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function toggleUserStatus(userId) {
  const res = await fetch(`${BASE}/users/${userId}/status`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to toggle user status');
  return res.json();
}

export async function deleteUser(userId) {
  const res = await fetch(`${BASE}/users/${userId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}
