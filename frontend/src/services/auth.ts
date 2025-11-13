import api from './api';

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', {
      email,
      password
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password
    });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/api/auth/me');
    return response.data.user;
  }
};

