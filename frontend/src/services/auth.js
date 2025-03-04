import axios from 'axios';
import { ref } from 'vue';

// Estado reativo da autenticação
const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const token = ref(localStorage.getItem('token') || null);

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
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Atualiza o estado reativo
        token.value = response.data.token;
        user.value = response.data.user;
      }

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Erro de conexão' };
    }
  },

  async register(name, email, password) {
    try {
      const response = await api.post('/auth/register', { name, email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Atualiza o estado reativo
        token.value = response.data.token;
        user.value = response.data.user;
      }

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Erro de conexão' };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Atualiza o estado reativo
    token.value = null;
    user.value = null;
  },

  getUser() {
    return user.value;
  },

  isAuthenticated() {
    return !!token.value;
  },

  user,
  token
};
