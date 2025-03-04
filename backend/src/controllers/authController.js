// Controller de autenticação
const { users } = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { HTTP_STATUS, BCRYPT_SALT_ROUNDS } = require('../utils/constants');

class AuthController {
  /**
   * Registro de novo usuário
   * Recebe nome, email e senha, criptografa a senha e salva no banco
   */
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validar dados de entrada
      if (!name || !email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: 'Dados incompletos. Nome, email e senha são obrigatórios.'
        });
      }

      // Verificar se o usuário já existe
      const userExists = await users.findOne({ where: { email } });
      if (userExists) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: 'Este email já está em uso.'
        });
      }

      // Criptografar a senha
      const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar o usuário no banco de dados
      const user = await users.create({
        name,
        email,
        password: hashedPassword
      });

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Erro ao registrar usuário'
      });
    }
  }

  /**
   * Login de usuário
   * Verifica se o email e senha estão corretos e gera um token JWT
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validar dados de entrada
      if (!email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: 'Email e senha são obrigatórios'
        });
      }

      // Verificar se o usuário existe
      const user = await users.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Verificar se a senha está correta
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Senha incorreta'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Erro ao realizar login'
      });
    }
  }

  /**
   * Alteração de senha
   * Permite que um usuário autenticado altere sua senha
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.userId; // Vem do middleware de autenticação

      // Validar dados de entrada
      if (!currentPassword || !newPassword) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: 'Senha atual e nova senha são obrigatórias'
        });
      }

      // Buscar o usuário no banco
      const user = await users.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Verificar se a senha atual está correta
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Senha atual incorreta'
        });
      }

      // Criptografar a nova senha
      const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Atualizar a senha no banco
      await user.update({ password: hashedPassword });

      return res.status(200).json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Erro ao alterar senha'
      });
    }
  }

  /**
   * Verifica se o token é válido e retorna os dados do usuário
   * Usado para validar autenticação no frontend
   */
  async verifyToken(req, res) {
    try {
      // Usuário já foi autenticado pelo middleware
      const user = await users.findByPk(req.userId, {
        attributes: ['id', 'name', 'email'] // Não retornar a senha
      });

      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Erro ao verificar token'
      });
    }
  }
}

module.exports = AuthController;