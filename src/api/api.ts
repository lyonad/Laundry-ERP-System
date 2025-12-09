const API_BASE_URL = 'http://localhost:3002/api';

// Generic fetch function with error handling and credentials
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include', // Important: Send cookies with requests
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      
      // If unauthorized, redirect to login
      if (response.status === 401) {
        window.location.href = '/login';
      }
      
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ==================== AUTH API ====================

export const authApi = {
  login: (username: string, password: string) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  logout: () => apiFetch('/auth/logout', {
    method: 'POST',
  }),
  getCurrentUser: () => apiFetch('/auth/me'),
};

// ==================== SERVICES API ====================

export const servicesApi = {
  getAll: () => apiFetch('/services'),
  getById: (id: string) => apiFetch(`/services/${id}`),
  create: (service: any) => apiFetch('/services', {
    method: 'POST',
    body: JSON.stringify(service),
  }),
  update: (id: string, service: any) => apiFetch(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(service),
  }),
  delete: (id: string) => apiFetch(`/services/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== INVENTORY API ====================

export const inventoryApi = {
  getAll: () => apiFetch('/inventory'),
  getLowStock: () => apiFetch('/inventory/low-stock'),
  getById: (id: string) => apiFetch(`/inventory/${id}`),
  create: (item: any) => apiFetch('/inventory', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  update: (id: string, item: any) => apiFetch(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  updateStock: (id: string, quantity: number, operation: 'add' | 'subtract') => 
    apiFetch(`/inventory/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity, operation }),
    }),
  delete: (id: string) => apiFetch(`/inventory/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== MEMBERS API ====================

export const membersApi = {
  getAll: () => apiFetch('/members'),
  getById: (id: string) => apiFetch(`/members/${id}`),
  create: (member: any) => apiFetch('/members', {
    method: 'POST',
    body: JSON.stringify(member),
  }),
  update: (id: string, member: any) => apiFetch(`/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(member),
  }),
  addPoints: (id: string, points: number) => apiFetch(`/members/${id}/points`, {
    method: 'PATCH',
    body: JSON.stringify({ points }),
  }),
  delete: (id: string) => apiFetch(`/members/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== ORDERS API ====================

export const ordersApi = {
  getAll: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiFetch(`/orders${query}`);
  },
  getById: (id: string) => apiFetch(`/orders/${id}`),
  create: (order: any) => apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  update: (id: string, order: any) => apiFetch(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(order),
  }),
  updateStatus: (id: string, status: string) => apiFetch(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  delete: (id: string) => apiFetch(`/orders/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== STATS API ====================

export const statsApi = {
  getDashboard: () => apiFetch('/stats/dashboard'),
  getRevenue: (startDate: string, endDate: string) => 
    apiFetch(`/stats/revenue?startDate=${startDate}&endDate=${endDate}`),
};

// ==================== SERVICE MATERIALS API ====================

export const serviceMaterialsApi = {
  getAll: (serviceId?: string) => {
    const query = serviceId ? `?serviceId=${serviceId}` : '';
    return apiFetch(`/service-materials${query}`);
  },
  getByServiceId: (serviceId: string) => apiFetch(`/service-materials/service/${serviceId}`),
  getById: (id: string) => apiFetch(`/service-materials/${id}`),
  create: (material: any) => apiFetch('/service-materials', {
    method: 'POST',
    body: JSON.stringify(material),
  }),
  update: (id: string, material: any) => apiFetch(`/service-materials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(material),
  }),
  delete: (id: string) => apiFetch(`/service-materials/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== NOTIFICATIONS API ====================

export const notificationsApi = {
  getAll: () => apiFetch('/notifications'),
  getUnreadCount: () => apiFetch('/notifications/unread-count'),
  markAsRead: (id: string) => apiFetch(`/notifications/${id}/read`, {
    method: 'PATCH',
  }),
  markAllAsRead: () => apiFetch('/notifications/mark-all-read', {
    method: 'PATCH',
  }),
  delete: (id: string) => apiFetch(`/notifications/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== HEALTH CHECK ====================

export const healthApi = {
  check: () => apiFetch('/health'),
};
