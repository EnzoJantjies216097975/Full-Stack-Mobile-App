import React from 'react';
import { useQuery } from 'react-query';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Chart } from 'recharts';

const Trainees = () => {
  const { data: trainees, isLoading } = useQuery('trainees', () =>
    api.get('/api/trainees')
  );

  const { data: traineeStats } = useQuery('traineeStats', () =>
    api.get('/api/trainee-stats')
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Trainees Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Trainees</h3>
          <p className="text-3xl font-bold mt-2">
            {traineeStats?.totalTrainees || 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Active This Week</h3>
          <p className="text-3xl font-bold mt-2">
            {traineeStats?.activeThisWeek || 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Avg. Workouts/Week</h3>
          <p className="text-3xl font-bold mt-2">
            {traineeStats?.averageWorkoutsPerWeek || 0}
          </p>
        </Card>
      </div>

      {/* Trainees Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainees?.data?.map((trainee) => (
              <TableRow key={trainee.id}>
                <TableCell className="font-medium">
                  {trainee.name}
                </TableCell>
                <TableCell>{trainee.currentProgram}</TableCell>
                <TableCell>
                  {new Date(trainee.lastActive).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${trainee.progress}%` }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Workout Completion Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={traineeStats?.completionRates || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Program Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={traineeStats?.programDistribution || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#3B82F6"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};