//app.js
const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();

// Controllers
const AuthController = require('./controllers/authController');
const RickAndMortyController = require('./controllers/rickAndMortyController');

// Instâncias dos controllers
const authController = new AuthController();
const rickAndMortyController = new RickAndMortyController();

// Middleware de autenticação
const authMiddleware = require('./middleware/auth');

// Middlewares globais
app.use(express.json());
app.use(cors());

// Rotas públicas (sem autenticação)
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// Rotas protegidas (requerem autenticação)
app.use('/api', authMiddleware); // Aplica o middleware de autenticação para todas as rotas /api/*

// Rota para verificar token
app.get('/api/auth/verify', authController.verifyToken);

// Rota para alterar senha
app.post('/api/auth/change-password', authController.changePassword);

// Rota para buscar personagens de Rick and Morty
app.get('/api/characters', rickAndMortyController.getCharacters);

module.exports = app;