import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Programs = () => {
  const { data: programs } = useQuery('programs', () => 
    api.get('/api/programs')
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workout Programs</h1>
        <Button>Create Program</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs?.data?.map((program) => (
          <Card key={program.id} className="p-6">
            <h3 className="text-lg font-medium">{program.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{program.description}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {program.exercises.length} exercises
              </p>
              <p className="text-sm text-gray-600">
                {program.duration} minutes total
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};