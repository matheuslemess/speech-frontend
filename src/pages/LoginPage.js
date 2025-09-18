import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  Flex
} from '@chakra-ui/react';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await api.post('/api/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError('Erro ao registrar. O e-mail já pode estar em uso.');
      console.error("Erro no registro:", err);
    }
  };

  return (
    <Flex align="center" justify="center" minH="80vh" p={[4, 6, 8]}>
      <Box 
        p={8} 
        maxWidth="400px" 
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg" 
        w="100%"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Heading as="h1" size="lg" mb={4}>
              Cadastrar
            </Heading>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormControl isRequired>
              <FormLabel>Nome:</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </FormControl>

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
                Entrar
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}

export default RegisterPage;