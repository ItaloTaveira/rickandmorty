import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import './style.css'

// Importar componentes de página
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Characters from './views/Characters.vue'
import Profile from './views/Profile.vue'

// Configuração do Vuetify
const vuetify = createVuetify({
  mobileBreakpoint: 0,
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

// Configuração das rotas
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    component: Register,
    name: 'register',
    meta: { requiresAuth: false }
  },
  {
    path: '/characters',
    component: Characters,
    name: 'characters',
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: Profile,
    name: 'profile',
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navegation guard para verificar autenticação
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  // Redirecionar para login se a rota requer autenticação e o usuário não está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  }
  // Redirecionar para characters se o usuário já está autenticado e tenta acessar login/register
  else if (!to.meta.requiresAuth && isAuthenticated) {
    next({ name: 'characters' })
  }
  // Caso contrário, prosseguir normalmente
  else {
    next()
  }
})

// Criar e montar a aplicação
createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
