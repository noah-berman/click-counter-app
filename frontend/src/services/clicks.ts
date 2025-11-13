import api from './api';

export interface Click {
  id: string;
  userId: string;
  timestamp: string;
}

export const clickService = {
  async recordClick(): Promise<{ click: Click }> {
    const response = await api.post<{ click: Click }>('/api/clicks');
    return response.data;
  },

  async getClickCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/api/clicks/count');
    return response.data.count;
  },

  async getUserClicks(): Promise<Click[]> {
    const response = await api.get<{ clicks: Click[] }>('/api/clicks');
    return response.data.clicks;
  }
};

