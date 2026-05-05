const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchPromotions() {
  const res = await fetch(`${BASE}/promotions`);
  if (!res.ok) throw new Error('Failed to fetch promotions');
  return res.json();
}

export async function createPromotion(data) {
  const res = await fetch(`${BASE}/promotions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create promotion');
  return res.json();
}

export async function updatePromotion(id, data) {
  const res = await fetch(`${BASE}/promotions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update promotion');
  return res.json();
}

export async function deletePromotion(id) {
  const res = await fetch(`${BASE}/promotions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete promotion');
  return res.json();
}
