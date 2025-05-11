const express = require('express');
const router = express.Router();

const rotasSaudacoes = require('./saudacoes.route');
const rotasDados = require('./dados.route');
const rotasCVE = require('./cve.route');

router.use('/saudacoes', rotasSaudacoes);
router.use('/dados', rotasDados);
router.use('/cves', rotasCVE);

router.get('/', (req, res) => {
  res.json({ mensagem: 'Bem-vindo à API principal!' });
});

module.exports = router;
