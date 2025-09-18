// Em src/pages/ProfilePage.js

import React, { useState, useEffect, useCallback } from 'react';
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
  Flex,
  IconButton,
  Text,
  Collapse,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { FaEdit, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';

function ProfilePage() {
  // Estado para controlar o modo de edição
  const [isEditing, setIsEditing] = useState(false);

  // Estados para os dados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  // Estado para guardar os dados originais e reverter em caso de cancelamento
  const [originalData, setOriginalData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Função para buscar os dados do usuário
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/me');
      const userData = response.data;
      
      // Preenche os estados com os dados recebidos
      setName(userData.name);
      setEmail(userData.email);
      setOriginalData(userData); // Guarda os dados originais

    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
      toast({
        title: 'Erro ao carregar perfil.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  // Busca os dados quando o componente é montado
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Lidar com o clique no botão "Editar"
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Lidar com o clique no botão "Cancelar"
  const handleCancelClick = () => {
    // Restaura os dados originais
    setName(originalData.name);
    setEmail(originalData.email);
    // Limpa os campos de senha
    setNewPassword('');
    setCurrentPassword('');
    // Sai do modo de edição
    setIsEditing(false);
  };

  // Lidar com o envio do formulário (Salvar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação: a senha atual é obrigatória para salvar
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
    
    // Adiciona a nova senha ao payload apenas se ela foi preenchida
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
      setIsEditing(false); // Sai do modo de edição
      fetchUserData(); // Recarrega os dados para garantir que tudo está atualizado
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
    <Box minH="100vh" w="100%" p={[4, 6, 8]} maxW="1200px" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
            <Heading as="h1" size="lg">Meu Perfil</Heading>
          <Flex justifyContent="flex-end" gap={2} alignItems="center">
            
                    <Button  onClick={() => navigate('/')}>
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
          
          {/* Seção de alteração de senha, visível apenas no modo de edição */}
          <Collapse in={isEditing} animateOpacity>
            <VStack spacing={6} align="stretch" p={4} borderWidth={1} borderRadius="md" mt={4}>
                <Heading as="h3" size="md">Alterar Senha</Heading>
                <Text fontSize="sm" color="gray.500">
                    Deixe em branco para não alterar a senha.
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

              <FormControl isRequired>
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

          {/* Botões de Salvar e Cancelar, visíveis apenas no modo de edição */}
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