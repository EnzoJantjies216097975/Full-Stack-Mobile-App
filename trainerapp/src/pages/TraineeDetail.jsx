import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TraineeDetail = () => {
  const { id } = useParams();
  
  const { data: trainee } = useQuery(['trainee', id], () =>
    api.get(`/api/trainees/${id}`)
  );

  const { data: workoutHistory } = useQuery(['traineeWorkouts', id], () =>
    api.get(`/api/trainees/${id}/workouts`)
  );

  const { data: nutritionData } = useQuery(['traineeNutrition', id], () =>
    api.get(`/api/trainees/${id}/nutrition`)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{trainee?.data?.name}</h1>
          <p className="text-gray-500">Member since {new Date(trainee?.data?.joinDate).toLocaleDateString()}</p>
        </div>
        <Button>Message Trainee</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm text-gray-500">Current Program</h3>
          <p className="text-xl font-bold mt-1">{trainee?.data?.currentProgram}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-500">Workouts Completed</h3>
          <p className="text-xl font-bold mt-1">{trainee?.data?.workoutsCompleted}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-500">Adherence Rate</h3>
          <p className="text-xl font-bold mt-1">{trainee?.data?.adherenceRate}%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-500">Last Active</h3>
          <p className="text-xl font-bold mt-1">
            {new Date(trainee?.data?.lastActive).toLocaleDateString()}
          </p>
        </Card>
      </div>

      {/* Workout Progress */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Workout Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={workoutHistory?.data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Nutrition Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Macronutrient Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nutritionData?.data?.macros || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="protein" stackId="a" fill="#3B82F6" />
                <Bar dataKey="carbs" stackId="a" fill="#10B981" />
                <Bar dataKey="fats" stackId="a" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Calorie Tracking</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nutritionData?.data?.calories || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Upcoming Sessions</h2>
        <div className="space-y-4">
          {trainee?.data?.upcomingSessions?.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{session.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(session.dateTime).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};