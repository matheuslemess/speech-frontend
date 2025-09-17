// Em src/pages/SpeechCreatorPage.js
import React, { useState } from 'react'; // <-- Corrigido o erro de digitação (vírgula a mais)
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Importando componentes do Chakra
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, HStack, Alert, AlertIcon, AlertDescription, useToast } from '@chakra-ui/react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function SpeechCreatorPage() {
  const [title, setTitle] = useState('');
  // O conteúdo agora será uma string HTML (ex: "<p><strong>Olá</strong></p>")
  const [content, setContent] = useState(''); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!title || !content) {
      setError('Título e conteúdo são obrigatórios.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await api.post('/api/speeches', 
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Discurso criado!",
        description: "Seu novo discurso foi salvo com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate('/');

    } catch (err) {
      setError('Ocorreu um erro ao salvar o discurso.');
      console.error("Erro ao criar discurso:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <Box minH="100vh" w="100%"  p={[4, 6, 8]}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="lg">Criar Novo Discurso</Heading>
          
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
              placeholder="Dê um título para seu discurso"
            />
          </FormControl>

<FormControl isRequired>
            <FormLabel>Conteúdo:</FormLabel>
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
              Salvar Discurso
            </Button>
          </HStack>

        </VStack>
      </form>
    </Box>
  );
}

export default SpeechCreatorPage;