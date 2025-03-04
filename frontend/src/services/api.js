/**
 * Serviço de API
 * Responsável por fazer requisições à API
 */
import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Serviço de API
 */
export default {
  /**
   * Busca personagens de Rick and Morty
   * @param {Number} page - Número da página
   */
  async getCharacters(page = 1) {
    try {
      const response = await api.get(`/api/characters?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Erro de conexão' };
    }
  }
};