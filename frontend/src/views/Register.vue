<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth';

// Variáveis reativas
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

// Método de registro
const register = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Por favor, preencha todos os campos.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem.';
    return;
  }

  try {
    loading.value = true;
    await authService.register(name.value, email.value, password.value);
    router.push({ name: 'characters' });
  } catch (err) {
    console.error(err);
    error.value = err.error || 'Erro ao criar conta.';
  } finally {
    loading.value = false;
  }
};

// Navegar para a página de login
const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="register-container">
    <h2 class="text-primary mb-4">
      <img src="https://img.icons8.com/?size=10000&id=hAPVXSp7TpSM&format=png" alt="Icon Left" class="login-icon left-icon" />
      Criar Conta
      <img src="https://img.icons8.com/?size=10000&id=udMvpkRHbzzS&format=png" alt="Right Left" class="login-icon right-icon" />
    </h2>

    <p class="mb-6 text-muted">Preencha os campos para se registrar</p>

    <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="register">
      <v-text-field
        v-model="name"
        label="Nome"
        placeholder="Nome"
        type="text"
        variant="outlined"
        required
        :disabled="loading"
        class="mb-4"
        color="blue"
        base-color="black"
        style="color: black;"
      ></v-text-field>

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
        placeholder="Senha"
        type="password"
        variant="outlined"
        required
        :disabled="loading"
        class="mb-4"
        color="blue"
        base-color="black"
        style="color: black;"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        label="Confirmar Senha"
        placeholder="Confirmar Senha"
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
        Criar Conta
      </v-btn>

      <p class="text-muted mt-6">Já tem uma conta?</p>

      <v-btn variant="text" color="primary" block @click="goToLogin" :disabled="loading" class="text-body-1">
        Fazer login
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.register-container {
  width: 400px;
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

.login-icon {
  width: 60px; /* Tamanho dos ícones */
  height: 60px;
  margin-inline: 15px;
}

.text-muted {
  color: #666;
}
</style>
