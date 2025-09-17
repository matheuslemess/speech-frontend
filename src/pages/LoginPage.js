// Em src/pages/LoginPage.js (VERSÃO FINAL E CORRETA)
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

// Importando os componentes que o SEU log de erro confirmou que existem
import {
  Box,
  Button,
  FormControl,  // <-- Usando o nome correto
  FormLabel,    // <-- Usando o nome correto
  Input,
  Heading,
  VStack,
  Text,
  Alert,
  AlertIcon,    // <-- Usando o nome correto
  AlertDescription,
  Link
} from '@chakra-ui/react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      console.error("Erro no login:", err);
    }
  };

  return (
    <Box p={[4, 6, 8]} maxW="1200px" mx="auto" bg="transparent" w="100%">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Heading as="h1" size="lg" mb={4}>Entrar</Heading>
          
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Usando a estrutura correta com FormControl */}
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
              placeholder="Sua senha"
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Entrar
          </Button>
          
          <Text pt={2}>
            Não tem uma conta?{' '}
            <Link as={RouterLink} to="/register" color="blue.500" fontWeight="bold">
              Cadastre-se
            </Link>
          </Text>

        </VStack>
      </form>
    </Box>
  );
}

export default LoginPage;