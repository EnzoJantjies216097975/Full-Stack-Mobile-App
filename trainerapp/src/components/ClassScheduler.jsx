import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ClassScheduler = ({ isOpen, onClose, onSave }) => {
  const [classData, setClassData] = useState({
    title: '',
    description: '',
    dateTime: new Date(),
    duration: 60,
    maxParticipants: 20,
    zoomLink: '',
    requirements: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(classData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Schedule New Class</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class Title</label>
            <Input
              value={classData.title}
              onChange={(e) => setClassData({ ...classData, title: e.target.value })}
              placeholder="Enter class title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={classData.description}
              onChange={(e) => setClassData({ ...classData, description: e.target.value })}
              placeholder="Enter class description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <Calendar
                selected={classData.dateTime}
                onSelect={(date) => setClassData({ ...classData, dateTime: date })}
                className="rounded-lg border"
              />
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <Input
                  type="number"
                  value={classData.duration}
                  onChange={(e) => setClassData({ ...classData, duration: parseInt(e.target.value) })}
                  min="15"
                  step="15"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Max Participants</label>
                <Input
                  type="number"
                  value={classData.maxParticipants}
                  onChange={(e) => setClassData({ ...classData, maxParticipants: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Zoom Link</label>
            <Input
              type="url"
              value={classData.zoomLink}
              onChange={(e) => setClassData({ ...classData, zoomLink: e.target.value })}
              placeholder="Enter Zoom meeting link"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Requirements</label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={classData.requirements}
              onChange={(e) => setClassData({ ...classData, requirements: e.target.value })}
              placeholder="Enter class requirements and materials needed"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Schedule Class</Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};