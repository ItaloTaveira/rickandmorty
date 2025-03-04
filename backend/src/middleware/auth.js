// Middleware de autenticação
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para verificar token JWT
 * Verifica se o usuário está autenticado através do token presente no header
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obter o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;
    
    // Verificar se o token existe
    if (!authHeader) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    // O token está no formato "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Erro no token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    // Verificar e decodificar o token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }

      // Salvar o ID do usuário para uso nas rotas
      req.userId = decoded.id;
      req.userName = decoded.name;
      return next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno na autenticação' });
  }
};

module.exports = authMiddleware;