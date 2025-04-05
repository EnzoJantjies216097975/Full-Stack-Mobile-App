import React from 'react';
import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import api from '../services/api';

const Dashboard = () => {
  const { data: stats } = useQuery('stats', () => api.get('/api/stats'));
  const { data: recentActivities } = useQuery('activities', () => 
    api.get('/api/recent-activities')
  );
  const { data: weeklyStats } = useQuery('weeklyStats', () => 
    api.get('/api/weekly-stats')
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Trainees</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalTrainees || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Active Programs</h3>
          <p className="text-3xl font-bold mt-2">{stats?.activePrograms || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Upcoming Classes</h3>
          <p className="text-3xl font-bold mt-2">{stats?.upcomingClasses || 0}</p>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Weekly Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyStats?.data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trainees" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities?.data?.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{activity.type}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};