const express = require('express');
const router = express.Router();
const cveControlador = require('../controllers/cve.controller');

router.get('/exploitdb', cveControlador.listarCVEsExploitDB);
router.get('/db', cveControlador.listarCVEsBancoDeDados);
router.get('/analisar/:numeroCVE', cveControlador.analisarCVE);
router.get('/explicar/:numeroCVE/json', cveControlador.obterExplicacaoJSON);

module.exports = router;
