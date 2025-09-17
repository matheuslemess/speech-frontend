// Em src/pages/RegisterPage.js (VERSÃO CHAKRA UI)
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  Link,
  useToast // Para a notificação de sucesso
} from '@chakra-ui/react';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await api.post('/auth/register', { email, password });

      // Mostra a notificação de sucesso
      toast({
        title: 'Conta criada com sucesso!',
        description: "Você será redirecionado para a página de login.",
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // Redireciona para o login após a notificação
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Este email já está em uso. Tente outro.');
      } else {
        setError('Ocorreu um erro ao realizar o cadastro.');
      }
      console.error("Erro no cadastro:", err);
    }
  };

  return (
    <Box p={[4, 6, 8]} maxW="1200px" mx="auto" bg="transparent" w="100%">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Heading as="h1" size="lg" mb={4}>Criar Conta</Heading>
          
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormControl isRequired>
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@exemplo.com"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Senha:</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Cadastrar
          </Button>
          
          <Text pt={2}>
            Já tem uma conta?{' '}
            <Link as={RouterLink} to="/login" color="blue.500" fontWeight="bold">
              Faça login
            </Link>
          </Text>

        </VStack>
      </form>
    </Box>
  );
}

export default RegisterPage;