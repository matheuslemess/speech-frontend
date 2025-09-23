import React, { useState, useCallback } from 'react'; // 1. Importe o useCallback
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TiptapEditor from '../components/TiptapEditor';
import '../styles/tiptap-custom.css'; 

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
  useToast 
} from '@chakra-ui/react';


function SpeechCreatorPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  // 2. Envolva a função de callback com o useCallback
  // Isso garante que a função não seja recriada em cada renderização
  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const handleSubmit = async (event) => {
    // ... (seu código de handleSubmit continua igual)
    event.preventDefault();
    setError('');
    const isContentEmpty = content.replace(/<(.|\n)*?>/g, '').trim().length === 0;
    if (!title || isContentEmpty) {
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
    <Box minH="100vh" w="100%" p={[4, 6, 8]}>
      <Box>
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
                <TiptapEditor
                    content={content}
                    onContentChange={handleContentChange}
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
                Salvar Discurso
              </Button>
            </HStack>

          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default SpeechCreatorPage;