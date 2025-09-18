// Em src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Spinner,
  useToast,
  Text,
  Divider,
  Alert,
  HStack,
  AlertIcon
} from '@chakra-ui/react';

function ProfilePage() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmail(response.data.email);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário", err);
        // Se falhar (token inválido, etc), desloga o usuário
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Você precisa digitar sua senha atual para salvar qualquer alteração.');
      return;
    }

    const payload = {
      currentPassword,
      email, // envia o email atual do estado
      newPassword: newPassword || undefined, // envia a nova senha apenas se ela for preenchida
    };

    try {
      const token = localStorage.getItem('token');
      await api.put('/api/users/me', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Limpa os campos de senha após o sucesso
      setCurrentPassword('');
      setNewPassword('');

    } catch (err) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao atualizar o perfil.');
      console.error("Erro na atualização:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" w="100%" p={[4, 6, 8]} maxW="1200px" mx="auto">
      <Heading as="h1" size="lg" mb={6}>
        Meu Perfil
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <FormControl>
            <FormLabel>Endereço de E-mail</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@exemplo.com"
            />
          </FormControl>

          <Divider my={4} />

          <Heading as="h2" size="md" mb={2}>
            Alterar Senha
          </Heading>
          
          <FormControl>
            <FormLabel>Nova Senha (opcional)</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Deixe em branco para não alterar"
            />
          </FormControl>
          
          <Divider my={4} />

          <FormControl isRequired>
            <FormLabel>Confirme sua Senha Atual para Salvar</FormLabel>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              Por segurança, precisamos da sua senha atual para confirmar as alterações.
            </Text>
          </FormControl>
        <HStack justifyContent="flex-end" mt={4}>
            <Button onClick={() => navigate('/')} colorScheme="gray">
                ← Voltar
            </Button>
            <Button               
                type="submit"
                colorScheme="blue"
                loadingText="Salvando...">
                Salvar Alterações
            </Button>
        </HStack>
        </VStack>
      </form>
    </Box>
  );
}

export default ProfilePage;