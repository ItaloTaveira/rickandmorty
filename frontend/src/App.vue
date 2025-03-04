<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from './services/auth';

// Computed para acompanhar mudanças no estado global do authService
const isAuthenticated = computed(() => !!authService.token.value);
const userName = computed(() => authService.user.value?.name || '');

const router = useRouter();
const route = useRoute();

// Função de logout
const logout = () => {
  authService.logout();
  router.push({ name: 'login' });
};

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div>
    <!-- Barra de navegação -->
    <header v-if="isAuthenticated">
      <nav class="header-nav">
        <h1>Rick and Morty World</h1>
        <div class="header-btn">
          <button v-if="route.name !== 'characters'" @click="goBack" class="back-btn">Voltar</button>
          <span>Olá, <strong>{{ userName }}</strong></span>
          <router-link to="/profile" class="profile-link">Meu Perfil</router-link>
          <button @click="logout">Sair</button>
        </div>
      </nav>
    </header>

    <!-- Conteúdo principal -->
    <main>
      <router-view />
    </main>

    <!-- Rodapé -->
    <footer>
      <a href="https://github.com/ItaloTaveira" target="_blank" class="github-btn">
        GitHub
        <i class="fab fa-github"></i>
      </a>
    </footer>
  </div>
</template>
