import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Grip, X } from 'lucide-react';

const ProgramCreator = () => {
  const [programData, setProgramData] = useState({
    name: '',
    description: '',
    difficulty: 'beginner',
    exercises: []
  });

  const { data: exercises } = useQuery('exercises', () => 
    api.get('/api/exercises')
  );

  const createProgramMutation = useMutation(
    (newProgram) => api.post('/api/programs', newProgram),
    {
      onSuccess: () => {
        // Handle success
      }
    }
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(programData.exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProgramData({ ...programData, exercises: items });
  };

  const addExercise = (exercise) => {
    setProgramData({
      ...programData,
      exercises: [
        ...programData.exercises,
        {
          exerciseId: exercise.id,
          name: exercise.name,
          sets: 3,
          reps: 12,
          duration: exercise.duration
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Program</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Program Details */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Program Name
                </label>
                <Input
                  value={programData.name}
                  onChange={(e) => setProgramData({
                    ...programData,
                    name: e.target.value
                  })}
                  placeholder="Enter program name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={4}
                  value={programData.description}
                  onChange={(e) => setProgramData({
                    ...programData,
                    description: e.target.value
                  })}
                  placeholder="Enter program description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Difficulty Level
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={programData.difficulty}
                  onChange={(e) => setProgramData({
                    ...programData,
                    difficulty: e.target.value
                  })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </form>
          </Card>

          {/* Exercise List */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-bold mb-4">Program Exercises</h2>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="exercises">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {programData.exercises.map((exercise, index) => (
                      <Draggable
                        key={exercise.exerciseId}
                        draggableId={exercise.exerciseId}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center bg-gray-50 p-4 rounded-lg"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="mr-3"
                            >
                              <Grip className="w-5 h-5 text-gray-400" />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-medium">{exercise.name}</h3>
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                <div>
                                  <label className="text-xs text-gray-500">
                                    Sets
                                  </label>
                                  <Input
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(e) => {
                                      const exercises = [...programData.exercises];
                                      exercises[index].sets = parseInt(e.target.value);
                                      setProgramData({ ...programData, exercises });
                                    }}
                                    min="1"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">
                                    Reps
                                  </label>
                                  <Input
                                    type="number"
                                    value={exercise.reps}
                                    onChange={(e) => {
                                      const exercises = [...programData.exercises];
                                      exercises[index].reps = parseInt(e.target.value);
                                      setProgramData({ ...programData, exercises });
                                    }}
                                    min="1"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">
                                    Duration (sec)
                                  </label>
                                  <Input
                                    type="number"
                                    value={exercise.duration}
                                    onChange={(e) => {
                                      const exercises = [...programData.exercises];
                                      exercises[index].duration = parseInt(e.target.value);
                                      setProgramData({ ...programData, exercises });
                                    }}
                                    min="0"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                const exercises = programData.exercises.filter(
                                  (_, i) => i !== index
                                );
                                setProgramData({ ...programData, exercises });
                              }}
                              className="ml-3 p-2 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </div>

        {/* Exercise Selection */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-lg font-bold mb-4">Available Exercises</h2>
          
          <Input
            type="search"
            placeholder="Search exercises..."
            className="mb-4"
          />

          <div className="space-y-2">
            {exercises?.data?.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => addExercise(exercise)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-medium">{exercise.name}</h3>
                <p className="text-sm text-gray-500">{exercise.category}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};