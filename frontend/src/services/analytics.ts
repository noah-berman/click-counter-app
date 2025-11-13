import api from './api';

export interface UserAnalytics {
  totalClicks: number;
  clicksToday: number;
  averagePerDay: number;
  clicks: Array<{
    id: string;
    userId: string;
    timestamp: string;
  }>;
}

export interface TopUser {
  user: {
    id: string;
    email: string;
  } | null;
  clickCount: number;
}

export interface GlobalAnalytics {
  totalClicks: number;
  topUsers: TopUser[];
}

export interface ClicksPerDay {
  date: string;
  clicks: number;
}

export interface ClicksPerDayResponse {
  clicksPerDay: ClicksPerDay[];
  startDate: string;
  endDate: string;
}

export const analyticsService = {
  async getUserAnalytics(): Promise<UserAnalytics> {
    const response = await api.get<UserAnalytics>('/api/analytics/user');
    return response.data;
  },

  async getGlobalAnalytics(): Promise<GlobalAnalytics> {
    const response = await api.get<GlobalAnalytics>('/api/analytics/global');
    return response.data;
  },

  async getClicksPerDay(days: number = 30): Promise<ClicksPerDayResponse> {
    const response = await api.get<ClicksPerDayResponse>('/api/analytics/clicks-per-day', {
      params: { days }
    });
    return response.data;
  }
};

