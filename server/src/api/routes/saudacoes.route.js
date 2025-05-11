const express = require('express');
const router = express.Router();
const saudacaoControlador = require('../controllers/saudacao.controller');

router.get('/ola', saudacaoControlador.obterSaudacao);

router.get('/tchau', saudacaoControlador.obterDespedida);

module.exports = router;
