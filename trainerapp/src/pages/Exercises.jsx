import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Exercises = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  const queryClient = useQueryClient();
  
  const { data: exercises } = useQuery('exercises', () => 
    api.get('/api/exercises')
  );

  const addExerciseMutation = useMutation(
    (newExercise) => api.post('/api/exercises', newExercise),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exercises');
        setIsAddModalOpen(false);
      },
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exercises</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises?.data?.map((exercise) => (
          <Card key={exercise.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{exercise.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {exercise.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedExercise(exercise)}
                  className="p-2 text-gray-600 hover:text-blue-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium">{exercise.category}</p>
              </div>
              <div>
                <p className="text-gray-600">Difficulty</p>
                <p className="font-medium">{exercise.difficulty}</p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium">{exercise.duration} min</p>
              </div>
              <div>
                <p className="text-gray-600">Calories</p>
                <p className="font-medium">{exercise.calories} kcal</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Exercise Modal */}
      {/* Implementation of modal component with form fields */}
    </div>
  );
};