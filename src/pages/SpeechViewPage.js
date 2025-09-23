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
  AlertDescription,
  HStack,
  IconButton,
  useColorMode,
  Flex
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaExpand, FaCompress, FaArrowLeft, FaMinus, FaPlus, FaBookReader } from 'react-icons/fa';

const paperwhiteStyles = {
  bg: '#FBFBF6',
  color: '#111111',
  fontFamily: "'Merriweather', serif",
};

function SpeechViewPage() {
  const [speech, setSpeech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fontSize, setFontSize] = useState(22);
  const [isPaperwhiteMode, setIsPaperwhiteMode] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const increaseFontSize = () => setFontSize(prev => prev + 2);
  const decreaseFontSize = () => setFontSize(prev => Math.max(12, prev - 2));

  const enterPresentationMode = () => {
    setIsPaperwhiteMode(true);
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  };

  const exitPresentationMode = () => {
    setIsPaperwhiteMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPaperwhiteMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
    <Box 
      p={[4, 6, 8]} 
      minH="100vh" 
      transition="background 0.3s ease-in-out"
      bg={isPaperwhiteMode ? paperwhiteStyles.bg : undefined}
      color={isPaperwhiteMode ? paperwhiteStyles.color : undefined}
      fontFamily={isPaperwhiteMode ? paperwhiteStyles.fontFamily : 'inherit'}
    >
      <Flex 
        justify="space-between" 
        align="center" 
        mb={6}
        position="sticky"
        top="0"
        zIndex="docked"
        bg={isPaperwhiteMode ? paperwhiteStyles.bg : undefined}
        p={2}
      >
        <HStack spacing={2} justify="center" w="100%">
          <IconButton
            aria-label="Voltar"
            icon={<FaArrowLeft />}
            onClick={() => navigate('/')}
            size="sm"
            color={isPaperwhiteMode ? paperwhiteStyles.color : undefined}
          />
          <IconButton
            aria-label="Diminuir fonte"
            icon={<FaMinus />}
            onClick={decreaseFontSize}
            size="sm"
            color={isPaperwhiteMode ? paperwhiteStyles.color : undefined}
          />
          <IconButton
            aria-label="Aumentar fonte"
            icon={<FaPlus />}
            onClick={increaseFontSize}
            size="sm"
            color={isPaperwhiteMode ? paperwhiteStyles.color : undefined}
          />
          <IconButton
            aria-label="Modo Apresentação"
            icon={<FaBookReader />}
            onClick={isPaperwhiteMode ? exitPresentationMode : enterPresentationMode}
            size="sm"
            color={isPaperwhiteMode ? paperwhiteStyles.color : undefined}
          />
          <IconButton
            aria-label="Alternar tema"
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            size="sm"
            color={isPaperwhiteMode ? paperwhiteStyles.color : undefined}
          />
          <IconButton
            aria-label="Tela cheia"
            icon={document.fullscreenElement ? <FaCompress /> : <FaExpand />}
            onClick={document.fullscreenElement ? exitPresentationMode : enterPresentationMode}
            size="sm"
            color={isPaperwhiteMode ? paperwhiteStyles.color : undefined}
          />
        </HStack>
      </Flex>

      <VStack spacing={6} align="stretch" maxW="800px" mx="auto">
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