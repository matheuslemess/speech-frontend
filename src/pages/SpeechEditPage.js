// Em src/pages/SpeechEditPage.js (VERSÃO CHAKRA UI)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Importando componentes do Chakra
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
  Text
} from '@chakra-ui/react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function SpeechEditPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Para o botão de salvar
  const [isFetching, setIsFetching] = useState(true); // Para o carregamento inicial
  
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

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
      <VStack>
        <Spinner size="xl" />
        <Text>Carregando discurso para edição...</Text>
      </VStack>
    );
  }

  return (
    <Box minH="100vh" w="100%"  p={[4, 6, 8]}>
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
            {/* 2. SUBSTITUIR O <Textarea> PELO <ReactQuill> */}
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              style={{ borderRadius: '8px' }}
            />
          </FormControl>
          
          <HStack justifyContent="flex-end">
            <Button onClick={() => navigate('/')} colorScheme="gray">
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
  );
}

export default SpeechEditPage;