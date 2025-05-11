// src/api/rotas/cve.rotas.js
const express = require('express');
const router = express.Router();
const cveControlador = require('../controllers/cve.controller');

// Endpoint: GET /api/cves/exploitdb
router.get('/exploitdb', cveControlador.listarCVEsExploitDB);

router.get('/db', cveControlador.listarCVEsBancoDeDados);

module.exports = router;