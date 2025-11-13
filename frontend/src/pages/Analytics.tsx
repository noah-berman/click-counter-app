import React, { useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import { analyticsService, UserAnalytics, GlobalAnalytics, ClicksPerDayResponse } from '../services/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const Analytics: React.FC = () => {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [globalAnalytics, setGlobalAnalytics] = useState<GlobalAnalytics | null>(null);
  const [clicksPerDay, setClicksPerDay] = useState<ClicksPerDayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [clicksPerDayLoading, setClicksPerDayLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'user' | 'global'>('user');
  const [dateRange, setDateRange] = useState<number>(30);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [userData, globalData] = await Promise.all([
          analyticsService.getUserAnalytics(),
          analyticsService.getGlobalAnalytics()
        ]);
        setUserAnalytics(userData);
        setGlobalAnalytics(globalData);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  useEffect(() => {
    const loadClicksPerDay = async () => {
      setClicksPerDayLoading(true);
      try {
        const data = await analyticsService.getClicksPerDay(dateRange);
        setClicksPerDay(data);
      } catch (error) {
        console.error('Failed to load clicks per day:', error);
      } finally {
        setClicksPerDayLoading(false);
      }
    };

    loadClicksPerDay();
  }, [dateRange]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800">
          <div className="text-lg text-gray-900 dark:text-white">Loading analytics...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('user')}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === 'user'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  Your Analytics
                </button>
                <button
                  onClick={() => setActiveTab('global')}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === 'global'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  Global Analytics
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'user' && userAnalytics && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {userAnalytics.totalClicks}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Clicks Today</div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {userAnalytics.clicksToday}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Per Day</div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {userAnalytics.averagePerDay.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'global' && globalAnalytics && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Global Statistics
                </h2>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Platform Clicks</div>
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {globalAnalytics.totalClicks}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Top Clickers
                </h3>
                <div className="space-y-2">
                  {globalAnalytics.topUsers.map((topUser, index) => (
                    <div
                      key={topUser.user?.id || index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {topUser.user?.email || 'Unknown User'}
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {topUser.clickCount} clicks
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  All Users' Combined Clicks Per Day
                </h3>
                
                {/* Date Range Filters */}
                <div className="mb-6 flex space-x-2">
                  <button
                    onClick={() => setDateRange(30)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        dateRange === 30
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    Past 30 Days
                  </button>
                  <button
                    onClick={() => setDateRange(7)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        dateRange === 7
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    Past 7 Days
                  </button>
                  <button
                    onClick={() => setDateRange(1)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        dateRange === 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    Past 1 Day
                  </button>
                </div>

                {clicksPerDayLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600 dark:text-gray-400">Loading chart data...</div>
                  </div>
                ) : clicksPerDay && clicksPerDay.clicksPerDay.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={clicksPerDay.clicksPerDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => {
                          try {
                            const date = new Date(value + 'T00:00:00');
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          } catch {
                            return value;
                          }
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => {
                          try {
                            const date = new Date(value + 'T00:00:00');
                            return date.toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            });
                          } catch {
                            return value;
                          }
                        }}
                      />
                      <Legend />
                      <Bar dataKey="clicks" fill="#3B82F6" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600 dark:text-gray-400">No click data available for this period</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

