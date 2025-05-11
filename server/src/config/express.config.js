// src/config/express.config.js
const express = require('express');
const logRequisicoes = require('../api/middlewares/logRequisicoes.middleware');
const rotasApi = require('../api/routes');

module.exports = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logRequisicoes);

  app.use(express.static('public'));

  // Configuração de CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use('/api', rotasApi);

  app.use((req, res, next) => {
    res.status(404).json({ mensagem: 'Rota não encontrada.' });
  });

  app.use((erro, req, res, next) => {
    console.error('Erro na aplicação:', erro.stack || erro);
    res.status(erro.status || 500).json({
      mensagem: erro.message || 'Ocorreu um erro interno no servidor.',
      ...(process.env.AMBIENTE === 'desenvolvimento' && { stack: erro.stack }),
    });
  });

  return app;
};
