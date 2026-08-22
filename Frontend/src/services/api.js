/**
 * Central API Client for GlobeTrotter Frontend
 * Handles base URL, auth token headers, JSON and FormData serialization, and error responses.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getAuthToken = () => {
  try {
    return localStorage.getItem('globetrotter_token') || null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('globetrotter_token', token);
    } else {
      localStorage.removeItem('globetrotter_token');
    }
  } catch (err) {
    console.error('Error saving auth token:', err);
  }
};

const buildHeaders = (isFormData = false, customHeaders = {}) => {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return { ...headers, ...customHeaders };
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const errorMessage =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      response.statusText ||
      `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
};

export const api = {
  async get(endpoint, params = {}) {
    const url = new URL(`${window.location.origin}${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(),
      credentials: 'include',
    });

    return handleResponse(response);
  },

  async post(endpoint, body = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });

    return handleResponse(response);
  },

  async put(endpoint, body = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });

    return handleResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'DELETE',
      headers: buildHeaders(),
      credentials: 'include',
    });

    return handleResponse(response);
  },

  async postForm(endpoint, formData) {
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: formData,
      credentials: 'include',
    });

    return handleResponse(response);
  },

  async putForm(endpoint, formData) {
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: formData,
      credentials: 'include',
    });

    return handleResponse(response);
  },
};
