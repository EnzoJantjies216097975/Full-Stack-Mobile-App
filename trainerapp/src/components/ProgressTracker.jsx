import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ProgressTracker = ({ traineeId }) => {
  const { data: progressData } = useQuery(['traineeProgress', traineeId], () =>
    api.get(`/api/trainees/${traineeId}/progress`)
  );

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Program Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-500">
                {progressData?.data?.overallProgress}%
              </span>
            </div>
            <Progress value={progressData?.data?.overallProgress || 0} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Workout Consistency</span>
              <span className="text-sm text-gray-500">
                {progressData?.data?.consistency}%
              </span>
            </div>
            <Progress
              value={progressData?.data?.consistency || 0}
              className="bg-green-100"
              indicatorClassName="bg-green-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Nutrition Adherence</span>
              <span className="text-sm text-gray-500">
                {progressData?.data?.nutritionAdherence}%
              </span>
            </div>
            <Progress
              value={progressData?.data?.nutritionAdherence || 0}
              className="bg-blue-100"
              indicatorClassName="bg-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Strength Progress */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Strength Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData?.data?.strengthProgress || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="benchPress"
                name="Bench Press"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="squat"
                name="Squat"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="deadlift"
                name="Deadlift"
                stroke="#F59E0B"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Body Composition */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Body Composition</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData?.data?.bodyComposition || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="weight"
                name="Weight"
                stroke="#3B82F6"
                fill="#93C5FD"
              />
              <Area
                type="monotone"
                dataKey="bodyFat"
                name="Body Fat %"
                stroke="#10B981"
                fill="#6EE7B7"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Recent Achievements</h2>
        <div className="space-y-4">
          {progressData?.data?.achievements?.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-medium">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(achievement.date).toLocaleDateString()}
                </p>
              </div>
              {achievement.improvement && (
                <div className="text-green-500 font-medium">
                  +{achievement.improvement}%
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};  