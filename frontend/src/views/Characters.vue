<script setup>
import { ref, onMounted } from 'vue';
import apiService from '../services/api';
import authService from '../services/auth';

// Variáveis reativas
const characters = ref([]);
const loading = ref(true);
const error = ref('');
const currentPage = ref(1);
const totalPages = ref(0);
const info = ref(null);
const userName = ref('');
const itemsPerPage = 18; // 6 colunas x 3 linhas = 18 personagens por página

// Buscar personagens da API
const fetchCharacters = async (page = 1) => {
  try {
    loading.value = true;
    const response = await apiService.getCharacters(page);
    characters.value = response.results.slice(0, itemsPerPage); // Limita os personagens por página
    info.value = response.info;
    totalPages.value = Math.ceil(response.info.count / itemsPerPage);
    currentPage.value = page;
  } catch (err) {
    console.error(err);
    error.value = err.error || 'Erro ao buscar personagens.';
  } finally {
    loading.value = false;
  }
};

// Navegação entre páginas
const nextPage = () => {
  if (currentPage.value < totalPages.value) fetchCharacters(currentPage.value + 1);
};
const prevPage = () => {
  if (currentPage.value > 1) fetchCharacters(currentPage.value - 1);
};

// Obter status traduzido e cor do chip
const getStatus = (status) => ({
  alive: 'Vivo',
  dead: 'Morto',
  unknown: 'Desconhecido',
}[status.toLowerCase()] || status);

const getStatusColor = (status) => ({
  alive: 'green',
  dead: 'red',
  unknown: 'grey',
}[status.toLowerCase()] || 'grey');

// Obter espécie traduzida
const getSpecies = (species) => ({
  human: 'Humano',
  alien: 'Alienígena',
}[species.toLowerCase()] || species);

// Obter localização corretamente
const getLocation = (location) => location?.name || 'Desconhecido';

// Ao montar o componente
onMounted(async () => {
  const user = authService.getUser();
  if (user) userName.value = user.name;
  await fetchCharacters();
});
</script>

<template>
  <div class="characters-container">
    <h2 class="text-primary mb-4">Personagens</h2>

    <p class="mb-4 text-muted">Explore os personagens de Rick and Morty</p>

    <v-alert v-if="error && !loading" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <!-- Loader -->
    <div v-if="loading" class="text-center my-4">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-body-1">Carregando personagens...</p>
    </div>

    <!-- Grid de personagens -->
    <div v-if="!loading && !error" class="characters-grid">
      <v-container class="pa-0">
        <v-row justify="center">
          <v-col
            v-for="character in characters"
            :key="character.id"
            cols="6"
            sm="4"
            md="2"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                class="character-card"
                :elevation="isHovering ? 8 : 2"
              >
                <v-img :src="character.image" height="150" cover class="character-image">
                  <v-card-title class="character-name">
                    {{ character.name }}
                  </v-card-title>
                </v-img>
                <v-card-text class="character-info">
                  <v-chip :color="getStatusColor(character.status)" class="status-chip">
                    {{ getStatus(character.status) }}
                  </v-chip>
                  <p><strong>Espécie:</strong> {{ getSpecies(character.species) }}</p>
                  <p><strong>Localização:</strong> {{ getLocation(character.location) }}</p>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Paginação -->
    <div v-if="!loading && !error" class="pagination-container">
      <v-btn prepend-icon="mdi-chevron-left" class="pagination-btn" @click="prevPage" :disabled="currentPage === 1">
        Anterior
      </v-btn>

      <span class="pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>

      <v-btn append-icon="mdi-chevron-right" class="pagination-btn" @click="nextPage" :disabled="currentPage === totalPages">
        Próxima
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
/* Container principal */
.characters-container {
  max-width: 1200px;
  max-height: 600px; /* Altura máxima definida */
  margin: 30px auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
  overflow-y: auto; /* Permite rolagem se ultrapassar */
}

/* Header */
.text-primary {
  color: #1e88e5;
  font-weight: bold;
}

.text-muted {
  color: #666;
}

/* Grid de personagens */
.characters-grid {
  width: 100%;
  max-width: 100%;
}

/* Cards de personagens */
.character-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 180px; /* Reduzido para caber no layout */
  margin: auto;
  height: 280px; /* Mantendo dentro da altura máxima */
}

.character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
}

.character-image {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.character-name {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  padding: 3px;
  font-size: 12px;
}

.character-info {
  font-size: 0.85rem;
}

/* Status chip */
.status-chip {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

/* Paginação */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
}

.pagination-info {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.pagination-btn:hover {
  background-color: #1565c0; /* Cor azul mais escura ao passar o mouse */
}

.pagination-btn {
  background-color: #1e88e5; /* Cor azul igual à do login */
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

/* Estilizando a barra de rolagem da `.characters-container` */
.characters-container::-webkit-scrollbar {
  width: 10px; /* Largura da barra de rolagem */
}

.characters-container::-webkit-scrollbar-thumb {
  background: #1e88e5; /* Cor da parte "arrastável" da barra */
  border-radius: 5px; /* Borda arredondada */
}

.characters-container::-webkit-scrollbar-thumb:hover {
  background: #1565c0; /* Cor ao passar o mouse */
}

.characters-container::-webkit-scrollbar-track {
  background: #f1f1f1; /* Cor do fundo da barra */
  border-radius: 5px;
}
</style>
