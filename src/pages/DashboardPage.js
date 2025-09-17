// Em src/pages/DashboardPage.js (VERSÃO CHAKRA UI)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

// Importando componentes Chakra
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Link,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  IconButton,
  useDisclosure // Hook para controlar o modal
} from '@chakra-ui/react';

// Importando nossos ícones
import { FaEdit, FaTrash, FaPlus, FaSun, FaMoon } from "react-icons/fa";


function DashboardPage() {
  const [speeches, setSpeeches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast(); // Hook para usar as notificações
  const { colorMode, toggleColorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure(); // Controla a visibilidade do modal
  const [speechToDelete, setSpeechToDelete] = useState(null); 

   const openConfirmationModal = (speech) => {
    setSpeechToDelete(speech); // Guarda o discurso
    onOpen(); // Abre o modal
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchSpeeches = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await api.get('/api/speeches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSpeeches(response.data);
      } catch (error) {
        console.error("Erro ao buscar discursos:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchSpeeches();
  }, [navigate, handleLogout]);

  const handleDelete = async () => {
    if (!speechToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/speeches/${speechToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose(); // Fecha o modal independentemente do resultado
      setSpeechToDelete(null); // Limpa o estado
    }
  };

  if (loading) {
    return (
      <VStack>
        <Spinner size="xl" />
        <Text>Carregando seus discursos...</Text>
      </VStack>
    );
  }

// Em DashboardPage.js (substitua o return)

return (
    <>
      <Box minH="100vh" w="100%" p={[4, 6, 8]}>
        <Box maxW="1200px" mx="auto">
          <Flex direction={["column", "row"]} justifyContent="space-between" alignItems="center" mb={6} pb={4} borderBottomWidth={1} gap={4}>
            <Heading as="h2" size="lg">Seus Discursos</Heading>
            <Flex alignItems="center">
              <IconButton
                  aria-label="Mudar tema"
                  icon={colorMode === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
                  onClick={toggleColorMode}
                  mr={4}
                  variant="ghost"
                />
              <Button onClick={handleLogout} colorScheme="gray" w={["100%", "auto"]}>Sair</Button>
            </Flex>
          </Flex>
          {loading ? ( <Box textAlign="center" p={10}><Spinner size="xl" /></Box> ) 
          : speeches.length === 0 ? (
            <Box textAlign="center" p={10} borderWidth={2} borderStyle="dashed" borderRadius="md" mt={6}>
              <Heading as="h3" size="md" mb={2}>Nenhum discurso por aqui!</Heading>
              <Text mb={4}>Que tal começar agora?</Text>
              <Button onClick={() => navigate('/discurso/novo')} colorScheme="blue" leftIcon={<FaPlus />}>Criar meu primeiro discurso</Button>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              <Flex direction={["column", "row"]} justifyContent="space-between" alignItems="center" gap={4}>
                <Text>Você tem {speeches.length} {speeches.length > 1 ? 'discursos salvos' : 'discurso salvo'}.</Text>
                <Button onClick={() => navigate('/discurso/novo')} colorScheme="blue" leftIcon={<FaPlus />} w={["100%", "auto"]}>Criar Novo Discurso</Button>
              </Flex>
              <VStack spacing={4} mt={4} align="stretch">
                {speeches.map(speech => (
                  <Flex key={speech.id} p={4} borderWidth={1} borderRadius="md" alignItems={["flex-start", "center"]} direction={["column", "row"]} _hover={{ boxShadow: 'md' }}>
                    <Link as={RouterLink} to={`/discurso/${speech.id}`} fontWeight="bold" fontSize="lg" flex="1" mb={[3, 0]}>{speech.title}</Link>
                    <Box w={["100%", "auto"]}>
                      <Button onClick={() => navigate(`/discurso/${speech.id}/editar`)} size="sm" mr={2} leftIcon={<FaEdit />}>Editar</Button>
                      <Button onClick={() => openConfirmationModal(speech)} size="sm" colorScheme="red" leftIcon={<FaTrash />}>Deletar</Button>
                    </Box>
                  </Flex>
                ))}
              </VStack>
            </VStack>
          )}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody><Text>Você tem certeza que deseja deletar o discurso: <strong>"{speechToDelete?.title}"</strong>?</Text><Text mt={2} color="gray.500">Esta ação não pode ser desfeita.</Text></ModalBody>
          <ModalFooter><Button colorScheme="gray" mr={3} onClick={onClose}>Cancelar</Button><Button colorScheme="red" onClick={handleDelete}>Deletar</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DashboardPage;