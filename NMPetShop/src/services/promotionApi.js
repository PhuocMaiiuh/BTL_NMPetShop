const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchPromotions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/promotions?${query}`);
  if (!res.ok) throw new Error('Failed to fetch promotions');
  return res.json();
}

export async function createPromotion(data) {
  const res = await fetch(`${BASE}/promotions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    const err = new Error(result.error || 'Failed to create promotion');
    err.details = result.details;
    throw err;
  }
  return result;
}

export async function updatePromotion(id, data) {
  const res = await fetch(`${BASE}/promotions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    const err = new Error(result.error || 'Failed to update promotion');
    err.details = result.details;
    throw err;
  }
  return result;
}

export async function deletePromotion(id) {
  const res = await fetch(`${BASE}/promotions/${id}`, { method: 'DELETE' });
  const result = await res.json();
  if (!res.ok) {
    const err = new Error(result.error || 'Failed to delete promotion');
    err.details = result.details;
    throw err;
  }
  return result;
}
export async function validatePromotionCode(code, totalAmount) {
  const res = await fetch(`${BASE}/promotions/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, totalAmount }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Mã giảm giá không hợp lệ');
  return result;
}
