const express = require('express');
const cors = require('cors');
const logRequisicoes = require('../api/middlewares/logRequisicoes.middleware');
const rotasApi = require('../api/routes');

module.exports = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(logRequisicoes);

  app.use(express.static('public'));

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Cache-Control',
      ],
    })
  );

  app.use('/api', rotasApi);

  app.use((req, res) => {
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
