import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  IconButton,
  HStack,
  Flex
} from '@chakra-ui/react';
import { FaArrowLeft, FaPlay, FaPause, FaRedo } from "react-icons/fa";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function PracticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [speech, setSpeech] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const bgColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const fetchSpeech = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/speeches/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpeech(response.data);
      } catch (err) {
        setError('Não foi possível carregar o discurso. Tente novamente.');
        console.error("Erro ao buscar discurso:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeech();
  }, [id]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box minH="100vh" w="100%" p={[4, 6, 8]} transition="background 0.3s ease-in-out">
      <VStack spacing={6} align="stretch">
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Heading as="h1" size="lg">
                Praticar Discurso
            </Heading>
            <Box w="40px" /> 
        </Box>

        <Box textAlign="center">
          <Text
            fontSize="5xl"
            fontWeight="bold"
            fontFamily="monospace"
            color={isActive ? "green.400" : time > 0 ? "yellow.400" : "gray.500"}
          >
            {formatTime(time)}
          </Text>
        </Box>
        
        <Flex justify="space-between" align="center" mb={6}>
          <HStack spacing={4} justify="center" w="100%">
            <IconButton
              aria-label="Voltar"
              icon={<FaArrowLeft />}
              onClick={() => navigate('/')}
              size="md"
            />
            <IconButton
              aria-label="Começar"
              colorScheme="green"
              icon={<FaPlay />}
              onClick={handleStart}
              size="md"
            />
            <IconButton
              aria-label="Pausar"
              colorScheme="yellow"
              icon={<FaPause />}
              onClick={handlePause}
              size="md"
            />
            <IconButton
              colorScheme="red"
              aria-label="Zerar"
              icon={<FaRedo />}
              onClick={handleReset}
              size="md"
            />
          </HStack>
        </Flex>

        <VStack spacing={4} align="stretch">
            <Heading as="h2" size="md">{speech?.title}</Heading>
            <Box
              p={4}
              bg={bgColor}
              borderRadius="md"
              maxH="50vh"
              overflowY="auto"
              dangerouslySetInnerHTML={{ __html: speech?.content }}
            />
        </VStack>
      </VStack>
    </Box>
  );
}

export default PracticePage;