const express = require('express');
const router = express.Router();
const cveControlador = require('../controllers/cve.controller');

router.get('/exploitdb', cveControlador.listarCVEsExploitDB);
// router.get('/db', cveControlador.listarCVEsBancoDeDados); // Replaced by getDbCves as per subtask
router.get('/db', cveControlador.getDbCves); // Route for fetching list of CVE IDs from "DB"

router.get('/analisar/:numeroCVE', cveControlador.analisarCVE);
router.get('/explicar/:numeroCVE/json', cveControlador.obterExplicacaoJSON);

// New routes for fetching CVE specific files
router.get('/:cveId/informacoes', cveControlador.getCveInformacoesJson);
router.get('/:cveId/docker-compose', cveControlador.getCveDockerCompose);
router.get('/:cveId/explicacao-html', cveControlador.getCveExplicacaoHtml);

// New route for registering a CVE
router.post('/registrar/:cveId', cveControlador.registrarCVE);


module.exports = router;
