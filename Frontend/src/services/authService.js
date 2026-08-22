import { api, setAuthToken } from './api';

export const authService = {
  async register(data) {
    // data can be FormData (with photo) or Object
    let res;
    if (data instanceof FormData) {
      res = await api.postForm('/auth/register', data);
    } else {
      res = await api.post('/auth/register', data);
    }
    if (res?.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  async login(credentials) {
    let res;
    if (credentials instanceof FormData) {
      res = await api.postForm('/auth/login', credentials);
    } else {
      res = await api.post('/auth/login', {
        identifier: credentials.identifier || credentials.email || credentials.username,
        password: credentials.password,
      });
    }
    if (res?.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API warning:', err);
    } finally {
      setAuthToken(null);
    }
  },

  async getMe() {
    return api.get('/auth/me');
  },

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, password, confirmPassword) {
    return api.post(`/auth/reset-password/${token}`, { password, confirmPassword });
  },
};
