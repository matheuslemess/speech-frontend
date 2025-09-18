import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';

import { 
  FaBookOpen, 
  FaEdit, 
  FaMoon, 
  FaPlus, 
  FaRegClock, 
  FaSignOutAlt, 
  FaSun, 
  FaTrash, 
  FaUserCircle 
} from "react-icons/fa";

function DashboardPage() {
  // --- 3. ESTADOS (States) ---
  const [user, setUser] = useState(null);
  const [speeches, setSpeeches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speechToDelete, setSpeechToDelete] = useState(null); 

  // --- 4. HOOKS ---
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // --- 5. FUNÇÕES E MANIPULADORES DE EVENTOS (Handlers) ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const openConfirmationModal = (speech) => {
    setSpeechToDelete(speech);
    onOpen();
  };

  const handleDelete = async () => {
    if (!speechToDelete) return;

    try {
      // O token agora é injetado pelo interceptor do Axios, não precisa mais estar aqui
      await api.delete(`/api/speeches/${speechToDelete.id}`);
      
      setSpeeches(currentSpeeches => currentSpeeches.filter(speech => speech.id !== speechToDelete.id));
      
      toast({
        title: "Discurso deletado.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erro ao deletar discurso:", error);
      toast({
        title: "Erro ao deletar.",
        description: "Ocorreu um problema ao tentar remover o discurso.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setSpeechToDelete(null);
    }
  };

  // --- 6. EFEITOS (useEffect) ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // As duas chamadas são feitas em paralelo para otimizar o carregamento
        const [userResponse, speechesResponse] = await Promise.all([
          api.get('/api/users/me'),
          api.get('/api/speeches')
        ]);
        
        setUser(userResponse.data);
        setSpeeches(speechesResponse.data);

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        handleLogout(); // Se qualquer chamada falhar, faz logout
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, handleLogout, toast]); // Adicionado `toast` às dependências

  // --- 7. RENDERIZAÇÃO DO COMPONENTE (JSX) ---
  return (
    <>
      <Box minH="100vh" w="100%" p={[4, 6, 8]}>
        <Box >
          {/* CABEÇALHO DA PÁGINA */}
          <Flex 
            direction={["column", "row"]} 
            justifyContent="space-between" 
            alignItems="center" 
            mb={6} 
            pb={4} 
            borderBottomWidth={1} 
            gap={4}
          >
            <Heading as="h2" size="lg">
              {user ? `Olá, ${user.name}!` : 'Seus Discursos'}
            </Heading>
            
            <Flex alignItems="center">
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar size={'sm'} name={user?.name} />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaUserCircle />} onClick={() => navigate('/perfil')}>
                    Meu Perfil
                  </MenuItem>
                  <MenuItem icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} onClick={toggleColorMode}>
                    Mudar Tema
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} color="red.500">
                    Sair
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {/* CONTEÚDO PRINCIPAL */}
          {loading ? ( 
            <Box textAlign="center" p={10}>
              <Spinner size="xl" />
            </Box> 
          ) : speeches.length === 0 ? (
            <Box textAlign="center" p={10} borderWidth={2} borderStyle="dashed" borderRadius="md" mt={6}>
              <Heading as="h3" size="md" mb={2}>Nenhum discurso por aqui!</Heading>
              <Text mb={4}>Que tal começar agora?</Text>
              <Button onClick={() => navigate('/discurso/novo')} colorScheme="blue" leftIcon={<FaPlus />}>
                Criar discurso
              </Button>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              <Flex 
                direction={["column", "row"]} 
                justifyContent="space-between" 
                alignItems="center" 
                mb={2} 
                gap={2}
              >
                <Text>Você tem {speeches.length} {speeches.length > 1 ? 'discursos salvos' : 'discurso salvo'}.</Text>
                <Button onClick={() => navigate('/discurso/novo')} colorScheme="blue" leftIcon={<FaPlus />} w={["100%", "auto"]}>
                  Novo Discurso
                </Button>
              </Flex>
              
              <VStack spacing={4} mt={4} align="stretch"> 
                {speeches.map(speech => (
                  <Flex 
                    key={speech.id} 
                    p={4} 
                    borderWidth={1} 
                    borderRadius="md" 
                    alignItems="center" 
                    direction={["column", "row"]} 
                    _hover={{ boxShadow: 'md' }} 
                    w="100%"
                  >
                    <Text fontWeight="bold" fontSize="lg" flex="1" w="100%" mb={[3, 0]}>
                      {speech.title}
                    </Text>

                    <Flex wrap="wrap" gap={2} mt={[4, 0]} justifyContent={["flex-start", "flex-end"]}>
                      <Button onClick={() => navigate(`/discurso/${speech.id}/editar`)} size="sm" colorScheme="yellow" aria-label="Editar">
                        <FaEdit />
                      </Button>
                      <Button onClick={() => openConfirmationModal(speech)} size="sm" colorScheme="red" aria-label="Deletar">
                        <FaTrash />
                      </Button>
                      <Button colorScheme="green" size="sm" onClick={() => navigate(`/discurso/${speech.id}/praticar`)} aria-label="Praticar">
                        <FaRegClock />
                      </Button>
                      <Button colorScheme="gray" size="sm" leftIcon={<FaBookOpen />} onClick={() => navigate(`/discurso/${speech.id}`)}>
                        Realizar
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              </VStack>
            </VStack>
          )}
        </Box>
      </Box>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Você tem certeza que deseja deletar o discurso: <strong>"{speechToDelete?.title}"</strong>?</Text>
            <Text mt={2} color="gray.500">Esta ação não pode ser desfeita.</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="red" onClick={handleDelete}>Deletar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// --- 8. EXPORTAÇÃO DO COMPONENTE ---
export default DashboardPage;