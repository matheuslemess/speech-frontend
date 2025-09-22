import React, { useState, useEffect, useCallback } from 'react'; // 1. Importe o useCallback
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
  Spinner,
  Text,
  Flex
} from '@chakra-ui/react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-custom.css';

// 2. Crie a versão memoizada do ReactQuill, assim como na outra página
const MemoizedReactQuill = React.memo(ReactQuill);

function SpeechEditPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // 3. Envolva a função de callback com o useCallback
  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  useEffect(() => {
    const fetchSpeech = async () => {
      setIsFetching(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/speeches/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError('Não foi possível carregar os dados para edição.');
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchSpeech();
  }, [id]);

  const handleSubmit = async (event) => {
    // ... (seu código de handleSubmit continua igual)
    event.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/speeches/${id}`, 
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Discurso atualizado!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (err) {
      setError('Ocorreu um erro ao atualizar o discurso.');
      console.error("Erro ao editar:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <VStack>
          <Spinner size="xl" />
          <Text mt={4}>Carregando discurso para edição...</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" w="100%" p={[4, 6, 8]}>
      <Box >
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <Heading as="h1" size="lg">Editar Discurso</Heading>
            
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormControl isRequired>
              <FormLabel>Título:</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Conteúdo:</FormLabel>
              {/* 4. Use o componente memoizado e a função estabilizada */}
              <MemoizedReactQuill
                theme="snow"
                value={content}
                onChange={handleContentChange}
              />
            </FormControl>
            
            <HStack justifyContent="flex-end" spacing={4}>
              <Button onClick={() => navigate('/')} variant="ghost">
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Salvando..."
              >
                Salvar Alterações
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default SpeechEditPage;