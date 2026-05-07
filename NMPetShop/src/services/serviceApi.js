const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchServices() {
  try {
    const res = await fetch(`${API_URL}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}
