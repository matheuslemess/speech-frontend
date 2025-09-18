// Em src/services/api.js

import axios from 'axios';

const api = axios.create({
  // Use a variável de ambiente para a URL da API, ou o valor padrão
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
});

// --- ADICIONE ESTE TRECHO ---
// Interceptor de Requisições
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');
    
    // Se o token existir, adiciona ao cabeçalho de autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Retorna a configuração modificada
  },
  (error) => {
    // Em caso de erro na configuração da requisição
    return Promise.reject(error);
  }
);
// --- FIM DO TRECHO ---

export default api;