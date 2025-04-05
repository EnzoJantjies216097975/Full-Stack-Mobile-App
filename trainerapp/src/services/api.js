// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor to handle errors and token expiration
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle 401 Unauthorized errors (token expired, etc.)
//     if (error.response && error.response.status === 401) {
//       // Clear token and redirect to login
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

// Create a mock data version of the API for development
const useMockData = true;

// Mock data implementation
const mockData = {
  // Auth endpoints
  '/auth/login': (data) => ({
    token: 'mock-token-12345',
    user: {
      id: 'trainer-1',
      name: 'John Trainer',
      email: 'trainer@example.com',
      role: 'trainer'
    }
  }),
  
  '/auth/validate': () => ({
    user: {
      id: 'trainer-1',
      name: 'John Trainer',
      email: 'trainer@example.com',
      role: 'trainer'
    }
  }),
  
  // Stats
  '/api/stats': () => ({
    totalTrainees: 45,
    activePrograms: 12,
    upcomingClasses: 8
  }),
  
  '/api/weekly-stats': () => ({
    data: [
      { day: 'Mon', trainees: 24 },
      { day: 'Tue', trainees: 18 },
      { day: 'Wed', trainees: 32 },
      { day: 'Thu', trainees: 27 },
      { day: 'Fri', trainees: 22 },
      { day: 'Sat', trainees: 14 },
      { day: 'Sun', trainees: 8 }
    ]
  }),
  
  '/api/recent-activities': () => ({
    data: [
      {
        id: 'act-1',
        type: 'New Trainee',
        description: 'Sarah Johnson joined your program',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: 'act-2',
        type: 'Completed Workout',
        description: 'Mike Thompson completed "Full Body HIIT"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
      },
      {
        id: 'act-3',
        type: 'Message',
        description: 'New message from Alex Wilson',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
      }
    ]
  }),
  
  // Exercises
  '/api/exercises': () => ({
    data: [
      {
        id: 'ex-1',
        name: 'Push Ups',
        description: 'Classic upper body exercise targeting chest, shoulders and triceps',
        videoUrl: 'https://example.com/videos/pushups.mp4',
        category: 'strength',
        difficulty: 'beginner',
        calories: 150,
        duration: 10
      },
      {
        id: 'ex-2',
        name: 'Squats',
        description: 'Lower body compound exercise focusing on quads, hamstrings and glutes',
        videoUrl: 'https://example.com/videos/squats.mp4',
        category: 'strength',
        difficulty: 'beginner',
        calories: 200,
        duration: 10
      },
      {
        id: 'ex-3',
        name: 'Plank',
        description: 'Core stabilizing exercise that engages multiple muscle groups',
        videoUrl: 'https://example.com/videos/plank.mp4',
        category: 'strength',
        difficulty: 'intermediate',
        calories: 80,
        duration: 5
      }
    ]
  }),
  
  // Programs
  '/api/programs': () => ({
    data: [
      {
        id: 'prog-1',
        name: 'Beginner Strength',
        description: 'A 4-week program designed for beginners to build strength',
        difficulty: 'beginner',
        exercises: [
          {id: 'ex-1'}, 
          {id: 'ex-2'}, 
          {id: 'ex-3'}
        ],
        duration: 30
      },
      {
        id: 'prog-2',
        name: 'HIIT Challenge',
        description: 'High intensity interval training for fat loss and conditioning',
        difficulty: 'intermediate',
        exercises: [
          {id: 'ex-1'}, 
          {id: 'ex-3'}
        ],
        duration: 20
      },
      {
        id: 'prog-3',
        name: 'Core Crusher',
        description: 'Strengthen your core with this targeted workout program',
        difficulty: 'advanced',
        exercises: [
          {id: 'ex-3'}
        ],
        duration: 15
      }
    ]
  }),
  
  // Classes
  '/api/classes': () => ({
    data: [
      {
        id: 'class-1',
        title: 'Morning Yoga',
        description: 'Start your day with energizing yoga poses',
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        duration: 45,
        maxParticipants: 20,
        participants: ['trainee-1', 'trainee-2', 'trainee-3'],
        zoomLink: 'https://zoom.us/j/123456789'
      },
      {
        id: 'class-2',
        title: 'HIIT Workout',
        description: 'High intensity intervals to boost your metabolism',
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        duration: 30,
        maxParticipants: 15,
        participants: ['trainee-4', 'trainee-5'],
        zoomLink: 'https://zoom.us/j/987654321'
      }
    ]
  }),
  
  // Trainees
  '/api/trainees': () => ({
    data: [
      {
        id: 'trainee-1',
        name: 'Sarah Johnson',
        currentProgram: 'Beginner Strength',
        lastActive: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        progress: 75
      },
      {
        id: 'trainee-2',
        name: 'Mike Thompson',
        currentProgram: 'HIIT Challenge',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        progress: 60
      },
      {
        id: 'trainee-3',
        name: 'Alex Wilson',
        currentProgram: 'Core Crusher',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        progress: 40
      }
    ]
  }),
  
  '/api/trainee-stats': () => ({
    totalTrainees: 45,
    activeThisWeek: 32,
    averageWorkoutsPerWeek: 3.5,
    completionRates: [
      { week: 'Week 1', rate: 85 },
      { week: 'Week 2', rate: 78 },
      { week: 'Week 3', rate: 82 },
      { week: 'Week 4', rate: 89 }
    ],
    programDistribution: [
      { name: 'Beginner Strength', value: 18 },
      { name: 'HIIT Challenge', value: 15 },
      { name: 'Core Crusher', value: 12 }
    ]
  })
};

// Helper function to handle mock API calls
const mockApiCall = (url, data = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Extract the endpoint path from the URL
      const path = url.replace(/^.*\/\/[^/]+/, '');
      const mockResponse = mockData[path] ? mockData[path](data) : { data: [] };
      
      resolve({ data: mockResponse });
    }, 300); // Simulate network delay
  });
};

// Create the real API client
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export a wrapped version of the API that checks if we should use mock data
const apiService = {
  get: (url) => {
    if (useMockData) {
      return mockApiCall(url);
    }
    return api.get(url);
  },
  
  post: (url, data) => {
    if (useMockData) {
      return mockApiCall(url, data);
    }
    return api.post(url, data);
  },
  
  put: (url, data) => {
    if (useMockData) {
      return mockApiCall(url, data);
    }
    return api.put(url, data);
  },
  
  delete: (url) => {
    if (useMockData) {
      return mockApiCall(url);
    }
    return api.delete(url);
  }
};

export default apiService;