import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import Programs from './pages/Programs';
import Classes from './pages/Classes';
import Trainees from './pages/Trainees';
import TraineeDetail from './pages/TraineeDetail'
import Login from './pages/Login';
import useAuth from './hooks/useAuth';
import ProgramCreator from './pages/ProgramCreator';

// Create QueryClient
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { initialize, isLoading } = useAuth();
  
  // Initialize auth state on app load
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="programs" element={<Programs />} />
            <Route path="programs/create" element={<ProgramCreator />} />
            <Route path="classes" element={<Classes />} />
            <Route path="trainees" element={<Trainees />} />
            <Route path="trainees/:id" element={<TraineeDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
