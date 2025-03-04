<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth';

// Variáveis reativas
const userName = ref('');
const userEmail = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const router = useRouter();

const passwordMismatch = ref(false);
const currentPasswordMismatch = ref(false);

// Carregar os dados do usuário ao entrar na página
onMounted(() => {
  const user = authService.getUser();
  if (user) {
    userName.value = user.name;
    userEmail.value = user.email;
  } else {
    router.push({ name: 'login' });
  }
});

// Alterar senha
const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Por favor, preencha todos os campos!';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem!';
    passwordMismatch.value = true;
    return;
  }

  try {
    loading.value = true;
    passwordMismatch.value = false;

    await authService.changePassword(currentPassword.value, newPassword.value);
    success.value = 'Senha alterada com sucesso!';

    // Limpa os campos após sucesso
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';

  } catch (err) {
    error.value = err.error || 'Senha incorreta!';
    currentPasswordMismatch.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="profile-container">
    <h2 class="text-primary mb-4">Meu Perfil</h2>

    <p class="mb-6 text-muted">Gerencie suas informações e segurança</p>

    <!-- Exibe as informações do usuário -->
    <div class="user-info">
      <p><strong>Nome:</strong> {{ userName }}</p>
      <p><strong>Email:</strong> {{ userEmail }}</p>
    </div>

    <h3 class="text-primary mt-6">Alterar Senha</h3>

    <!-- Alertas -->
    <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <v-alert v-if="success" type="success" class="mb-4">
      {{ success }}
    </v-alert>

    <!-- Formulário de alteração de senha -->
    <v-form @submit.prevent="changePassword">
      <v-text-field
        v-model="currentPassword"
        label="Senha Atual"
        placeholder="Digite sua senha atual"
        type="password"
        variant="outlined"
        required
        class="mb-4"
        color="blue"
        base-color="black"
        style="color: black;"
        :error="currentPasswordMismatch"
      ></v-text-field>

      <v-text-field
        v-model="newPassword"
        label="Nova Senha"
        placeholder="Digite sua nova senha"
        type="password"
        variant="outlined"
        required
        class="mb-4"
        color="blue"
        base-color="black"
        style="color: black;"
        :error="passwordMismatch"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        label="Confirmar Nova Senha"
        placeholder="Repita a nova senha"
        type="password"
        variant="outlined"
        required
        class="mb-6"
        color="blue"
        base-color="black"
        style="color: black;"
        :error="passwordMismatch"
      ></v-text-field>

      <v-btn type="submit" color="primary" block :loading="loading" :disabled="loading" class="py-3">
        Alterar Senha
      </v-btn>

      <p class="text-muted mt-6">Deseja sair da conta?</p>

      <v-btn variant="text" color="primary" block @click="authService.logout(); router.push({ name: 'login' })" :disabled="loading" class="text-body-1">
        Sair da Conta
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
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
}

.text-muted {
  color: #707070;
}

.user-info {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: left;
}

.user-info p {
  margin: 0;
  padding: 0.5rem 0;
  color: black;
}

::v-deep(.v-input) {
  margin-bottom: 0 !important;
}
</style>
