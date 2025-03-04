<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth';

// Variáveis reativas
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

// Método de login
const login = async () => {
  if (!email.value || !password.value) {
    error.value = 'Por favor, preencha todos os campos.';
    return;
  }

  try {
    loading.value = true;
    await authService.login(email.value, password.value);
    router.push({ name: 'characters' });
  } catch (err) {
    console.error(err);
    error.value = err.error || 'Erro ao fazer login. Verifique suas credenciais.';
  } finally {
    loading.value = false;
  }
};

// Navegar para a página de registro
const goToRegister = () => {
  router.push({ name: 'register' });
};
</script>

<template>
  <div class="login-container">
    <div class="login-title">
      <h2 class="text-primary mb-4">
        <img src="https://img.icons8.com/?size=10000&id=hAPVXSp7TpSM&format=png" alt="Icon Left" class="login-icon left-icon" />
        Login
        <img src="https://img.icons8.com/?size=10000&id=udMvpkRHbzzS&format=png" alt="Right Left" class="login-icon right-icon" />
      </h2>
    </div>

    <p class="mb-6 text-muted">Entre com suas credenciais para continuar</p>

    <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="login">
      <v-text-field
        v-model="email"
        label="Email"
        placeholder="Email"
        type="email"
        variant="outlined"
        required
        :disabled="loading"
        class="mb-4"
        color="blue"
        base-color="black"
        style="color: black;"
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Senha"
        placeholder="Email"
        type="password"
        variant="outlined"
        required
        :disabled="loading"
        class="mb-6"
        color="blue"
        base-color="black"
        style="color: black;"
      ></v-text-field>

      <v-btn type="submit" color="primary" block :loading="loading" :disabled="loading" class="py-3">
        Entrar
      </v-btn>

      <p class="text-muted mt-6">Ainda não tem uma conta?</p>

      <v-btn variant="text" color="primary" block @click="goToRegister" :disabled="loading" class="text-body-1">
        Criar uma conta
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 10px auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
}

.text-primary {
  color: #1e88e5;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-muted {
  color: #666;
}

.login-icon {
  width: 60px; /* Tamanho dos ícones */
  height: 60px;
  margin-inline: 15px;
}
</style>
