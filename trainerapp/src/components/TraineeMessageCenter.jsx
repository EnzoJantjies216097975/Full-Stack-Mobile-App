import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';

const TraineeMessageCenter = ({ traineeId }) => {
  const [message, setMessage] = useState('');
  
  const { data: messages, refetch: refetchMessages } = useQuery(
    ['traineeMessages', traineeId],
    () => api.get(`/api/trainees/${traineeId}/messages`)
  );

  const sendMessageMutation = useMutation(
    (newMessage) => api.post(`/api/trainees/${traineeId}/messages`, newMessage),
    {
      onSuccess: () => {
        refetchMessages();
        setMessage('');
      }
    }
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate({ content: message });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <MessageCircle className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-bold">Messages</h2>
      </div>

      <div className="h-96 overflow-y-auto mb-4 space-y-4">
        {messages?.data?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.fromTrainer ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.fromTrainer
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!message.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
};