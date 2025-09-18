import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/me');
      const userData = response.data;
      
      setName(userData.name);
      setEmail(userData.email);
      setOriginalData(userData);

    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
      toast({
        title: 'Erro ao carregar perfil.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/'); // Navega de volta para a página principal em caso de erro
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setName(originalData.name);
    setEmail(originalData.email);
    setNewPassword('');
    setCurrentPassword('');
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast({
        title: 'Senha atual é obrigatória para salvar.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      name,
      email,
      currentPassword,
    };
    
    if (newPassword) {
      payload.newPassword = newPassword;
    }

    try {
      await api.put('/api/users/me', payload);
      toast({
        title: 'Perfil atualizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar o perfil.';
      toast({
        title: 'Erro ao salvar.',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Box textAlign="center" p={10}><Spinner size="xl" /></Box>;
  }

  return (
    <Box minH="100vh" w="100%" p={[4, 6, 8]}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="lg">Meu Perfil</Heading>
            <Flex gap={2}>
              <Button onClick={() => navigate('/')}>
                ← Voltar
              </Button>
              {!isEditing && (
                <IconButton
                  aria-label="Editar Perfil"
                  icon={<FaEdit />}
                  onClick={handleEditClick}
                  colorScheme="blue"
                />
              )}
            </Flex>
          </Flex>

          <FormControl>
            <FormLabel>Nome</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              isDisabled={!isEditing}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isDisabled={!isEditing}
            />
          </FormControl>
          
          <Collapse in={isEditing} animateOpacity>
            <VStack spacing={6} align="stretch" p={4} borderWidth={1} borderRadius="md" mt={4}>
              <Heading as="h3" size="md">Alterar Senha</Heading>
              <Text fontSize="sm" color="gray.500">
                  Deixe os campos de senha em branco para não a alterar.
              </Text>
              
              <FormControl>
                <FormLabel>Nova Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="********"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired={isEditing}>
                <FormLabel>Sua Senha Atual (para confirmar)</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Obrigatória para salvar"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Mostrar/Ocultar senha"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </VStack>
          </Collapse>

          {isEditing && (
            <Flex justifyContent="flex-end" gap={2}>
              <Button onClick={handleCancelClick}>
                Cancelar
              </Button>
              <Button type="submit" leftIcon={<FaSave />} colorScheme="blue">
                Salvar Alterações
              </Button>
            </Flex>
          )}
        </VStack>
      </form>
    </Box>
  );
}

export default ProfilePage;