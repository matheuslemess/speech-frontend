import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, useColorMode } from '@chakra-ui/react'; // Importe useColorMode
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SpeechCreatorPage from './pages/SpeechCreatorPage';
import SpeechEditPage from './pages/SpeechEditPage';
import SpeechViewPage from './pages/SpeechViewPage';
import ProfilePage from './pages/ProfilePage';
import PracticePage from './pages/PracticePage';

function App() {
  // Pega o modo de cor atual
  const { colorMode } = useColorMode();

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      // Define o fundo dinamicamente
      bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
      p={4}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/discurso/novo" element={<ProtectedRoute><SpeechCreatorPage /></ProtectedRoute>} />
        <Route path="/discurso/:id" element={<ProtectedRoute><SpeechViewPage /></ProtectedRoute>} />
        <Route path="/discurso/:id/praticar" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
        <Route path="/discurso/:id/editar" element={<ProtectedRoute><SpeechEditPage /></ProtectedRoute>} />
      </Routes>
    </Box>
  );
}

export default App;