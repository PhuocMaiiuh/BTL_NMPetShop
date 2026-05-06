const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/orders?${query}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function fetchOrderStats() {
  const res = await fetch(`${BASE}/orders/stats`);
  if (!res.ok) throw new Error('Failed to fetch order stats');
  return res.json();
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${BASE}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
}

export async function deleteOrder(orderId) {
  const res = await fetch(`${BASE}/orders/${orderId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete order');
  return res.json();
}

export async function fetchUserOrders(userId) {
  const res = await fetch(`${BASE}/orders/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user orders');
  return res.json();
}

export async function fetchOrderById(orderId) {
  const res = await fetch(`${BASE}/orders/${orderId}`);
  if (!res.ok) throw new Error('Failed to fetch order details');
  return res.json();
}
export async function createOrder(data) {
  const res = await fetch(`${BASE}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to create order');
  }
  return res.json();
}
