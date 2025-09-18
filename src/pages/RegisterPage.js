// Em src/pages/RegisterPage.js (VERSÃO COM BARRA DE FORÇA)
import React, { useState, useEffect } from 'react';
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
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Collapse,
  Progress // Componente para a barra de progresso
} from '@chakra-ui/react';
// Importando os ícones
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Novo estado para a pontuação da força da senha
  const [strength, setStrength] = useState(0); 

  const navigate = useNavigate();
  const toast = useToast();

  // Mapeamento de pontuação para cor e texto
  const strengthLevels = [
    { label: "", color: "gray" }, // Pontuação 0
    { label: "Muito Fraca", color: "red" }, // Pontuação 1
    { label: "Fraca", color: "orange" }, // Pontuação 2
    { label: "Média", color: "yellow" }, // Pontuação 3
    { label: "Forte", color: "blue" }, // Pontuação 4
    { label: "Muito Forte", color: "green" }, // Pontuação 5
  ];

  // useEffect para calcular a força da senha em tempo real
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    // Se a senha estiver vazia, a pontuação é 0
    if (password.length === 0) {
      score = 0;
    }

    setStrength(score);
  }, [password]);

  const passwordsMatch = password && password === confirmPassword;

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

  if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (!passwordsMatch) {
      setError('As senhas não coincidem.');
      return;
    }

    // A senha é considerada válida se atingir a pontuação máxima
    if (strength < 5) {
      setError('Sua senha não atende a todos os critérios de segurança.');
      return;
    }

    try {
      await api.post('/api/auth/register', { name, email, password });
      toast({
        title: 'Conta criada com sucesso!',
        description: "Você será redirecionado para a página de login.",
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
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
        <VStack spacing={4} align="stretch">
          <Heading as="h1" size="lg" mb={4} textAlign="center">Criar Conta</Heading>
          
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <FormControl isRequired>  {/* <-- BLOCO NOVO */}
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
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha"
              />
              <InputRightElement>
                <IconButton
                  aria-label="Mostrar/Ocultar senha"
                  variant="ghost"
                  onClick={handlePasswordVisibility}
                  icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                />
              </InputRightElement>
            </InputGroup>
            
            {/* Barra de Força da Senha */}
            <Collapse in={password.length > 0} animateOpacity>
              <VStack align="stretch" mt={2} spacing={1}>
                <Progress 
                  value={(strength / 5) * 100} 
                  colorScheme={strengthLevels[strength].color}
                  size="xs" 
                  borderRadius="full"
                />
                <Text fontSize="xs" color="gray.500" textAlign="right">
                  {strengthLevels[strength].label}
                </Text>
              </VStack>
            </Collapse>

          </FormControl>

          <FormControl isRequired isInvalid={confirmPassword && !passwordsMatch}>
            <FormLabel>Confirmar Senha:</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
              />
               <InputRightElement>
                <IconButton
                  aria-label="Mostrar/Ocultar senha"
                  variant="ghost"
                  onClick={handlePasswordVisibility}
                  icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                />
              </InputRightElement>
            </InputGroup>
            {confirmPassword && !passwordsMatch && (
              <Text color="red.500" fontSize="sm" mt={1}>
                As senhas não coincidem.
              </Text>
            )}
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Cadastrar
          </Button>
          
          <Text pt={2} textAlign="center">
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