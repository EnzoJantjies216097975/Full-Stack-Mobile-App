import React from 'react';
import { useQuery } from 'react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Classes = () => {
  const { data: classes } = useQuery('classes', () => 
    api.get('/api/classes')
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Online Classes</h1>
        <Button>Schedule Class</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes?.data?.map((classItem) => (
          <Card key={classItem.id} className="p-6">
            <h3 className="text-lg font-medium">{classItem.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {classItem.description}
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <span className="text-gray-600">Date: </span>
                {new Date(classItem.dateTime).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Time: </span>
                {new Date(classItem.dateTime).toLocaleTimeString()}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Duration: </span>
                {classItem.duration} minutes
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Participants: </span>
                {classItem.participants.length}/{classItem.maxParticipants}
              </p>
            </div>
            <Button className="mt-4 w-full">View Details</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};