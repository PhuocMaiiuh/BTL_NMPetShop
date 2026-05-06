const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 */
export async function loginApi(email, password) {
  const res = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Đăng nhập thất bại');
  }
  return data;
}

/**
 * Fetch all users (admin)
 */
export async function fetchUsers({ search = '', role = '', page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (role) params.set('role', role);
  params.set('page', page);
  params.set('limit', limit);

  const res = await fetch(`${BASE}/users?${params}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}
/**
 * Toggle user status (admin)
 * @param {string} id 
 */
export async function toggleUserStatus(id) {
  const res = await fetch(`${BASE}/users/${id}/status`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to toggle user status');
  return res.json();
}

/**
 * Delete a user (admin)
 * @param {string} id 
 */
export async function deleteUser(id) {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}
