import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  IconButton,
  useColorMode,
  Flex
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaExpand, FaCompress } from 'react-icons/fa';

function SpeechViewPage() {
  const [speech, setSpeech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fontSize, setFontSize] = useState(22);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const increaseFontSize = () => setFontSize(prev => prev + 2);
  const decreaseFontSize = () => setFontSize(prev => Math.max(12, prev - 2));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const fetchSpeech = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/speeches/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSpeech(response.data);
      } catch (err) {
        setError('Não foi possível carregar o discurso.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeech();
  }, [id]);

  if (loading) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <VStack>
          <Spinner size="xl" />
          <Text mt={4}>Carregando discurso...</Text>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex h="100vh" justify="center" align="center" p={4}>
        <Alert status="error" borderRadius="md" maxW="800px">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Flex>
    );
  }

  if (!speech) {
    return (
        <Flex h="100vh" justify="center" align="center">
            <Text>Discurso não encontrado.</Text>
        </Flex>
    );
  }

  return (
    <Box p={[0, 6, 8]} minH="100vh" transition="background 0.3s ease-in-out">
      <Flex justify="space-between" align="center" mb={6}>
        <Button size="sm" onClick={() => navigate('/')} variant="outline">
          ← Voltar
        </Button>

        <HStack spacing={2}>
          <IconButton
            aria-label="Diminuir fonte"
            icon={<Text fontWeight="bold">-</Text>}
            onClick={decreaseFontSize}
            size="sm"
          />
          <IconButton
            aria-label="Aumentar fonte"
            icon={<Text fontWeight="bold">+</Text>}
            onClick={increaseFontSize}
            size="sm"
          />
          <IconButton
            aria-label="Alternar tema"
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            size="sm"
          />
          <IconButton
            aria-label="Tela cheia"
            icon={isFullscreen ? <FaCompress /> : <FaExpand />}
            onClick={toggleFullscreen}
            size="sm"
          />
        </HStack>
      </Flex>

      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center">
          {speech.title}
        </Heading>

        <Box
          className="ql-snow"
          lineHeight="1.8"
          fontSize={`${fontSize}px`}
          transition="font-size 0.2s ease-in-out"
        >
          <Box
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: speech.content }}
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default SpeechViewPage;