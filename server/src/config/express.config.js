// src/config/express.config.js
const express = require('express');
const cors = require('cors');
const logRequisicoes = require('../api/middlewares/logRequisicoes.middleware');
const rotasApi = require('../api/routes');

module.exports = () => {
  const app = express();

  // body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // log
  app.use(logRequisicoes);

  // arquivos estáticos
  app.use(express.static('public'));

  // CORS (já trata OPTIONS automaticamente)
  app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept', 'Cache-Control']
  }));

  // suas rotas
  app.use('/api', rotasApi);

  // 404
  app.use((req, res) => {
    res.status(404).json({ mensagem: 'Rota não encontrada.' });
  });

  // erro geral
  app.use((erro, req, res, next) => {
    console.error('Erro na aplicação:', erro.stack || erro);
    res.status(erro.status || 500).json({
      mensagem: erro.message || 'Ocorreu um erro interno no servidor.',
      ...(process.env.AMBIENTE === 'desenvolvimento' && { stack: erro.stack }),
    });
  });

  return app;
};
