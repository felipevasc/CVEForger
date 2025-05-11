const express = require('express');
const router = express.Router();
const dadosControlador = require('../controllers/dados.controller');

// Exemplo API 2: POST /api/dados/enviar
router.post('/enviar', dadosControlador.receberDados);

// Exemplo API 2 (variação): GET /api/dados/listar
router.get('/listar', dadosControlador.listarDados);

module.exports = router;
