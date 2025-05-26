const fsPromises = require('fs').promises; // Changed to use fs.promises
const fs = require('fs'); // Keep original fs for readFile if not converting all fs calls
const path = require('path');
const exploitDBServico = require('../../services/exploit-db.service');
const cveAnaliseServico = require('../../services/cve-analise.service');
const cveExplicacaoServico = require('../../services/cve-explicacao.service');

const OUTPUT_DIR = path.join(__dirname, '../../../../output'); // Adjusted path to output directory

const listarCVEsExploitDB = async (req, res, next) => {
  try {
    const cves = await exploitDBServico.obterCVEsDoExploitDB();
    res.status(200).json({
      fonte: 'Exploit-DB (via files_exploits.csv)',
      totalCVEs: cves.length,
      cves: cves,
      dataAtualizacaoCSVPrevista: 'Diária (pelo Exploit-DB)',
    });
  } catch (erro) {
    next(erro);
  }
};

// Function to list CVEs by scanning the output directory
const getDbCves = async (req, res, next) => {
  try {
    const allEntries = await fsPromises.readdir(OUTPUT_DIR, { withFileTypes: true });
    const cveDirectories = allEntries
      .filter(dirent => dirent.isDirectory() && /^CVE-\d{4}-\d{4,}$/i.test(dirent.name))
      .map(dirent => dirent.name.toUpperCase()); // Standardize to uppercase

    res.status(200).json(cveDirectories);
  } catch (error) {
    console.error('[CVE Controller] Error listing CVEs from output directory:', error);
    if (error.code === 'ENOENT') {
      // If the output directory doesn't exist, return an empty list with a 404
      return res.status(404).json({ message: 'Output directory not found.', cves: [] });
    }
    // Pass other errors to the global error handler
    next(error); 
  }
};

const getCveInformacoesJson = async (req, res, next) => {
  try {
    const { cveId } = req.params;
    if (!cveId || !cveId.match(/^CVE-\d{4}-\d+$/i)) { // Case-insensitive match
      return res.status(400).json({
        erro: 'Número de CVE inválido. Formato esperado: CVE-YYYY-NNNNN',
      });
    }
    const filePath = path.join(OUTPUT_DIR, cveId.toUpperCase(), 'informacoes.json'); // Ensure CVE ID is uppercase for path

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ erro: 'Arquivo informacoes.json não encontrado para este CVE.' });
        }
        return next(err);
      }
      try {
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData);
      } catch (parseError) {
        next(parseError);
      }
    });
  } catch (erro) {
    next(erro);
  }
};

const getCveDockerCompose = async (req, res, next) => {
  try {
    const { cveId } = req.params;
    if (!cveId || !cveId.match(/^CVE-\d{4}-\d+$/i)) {
      return res.status(400).json({
        erro: 'Número de CVE inválido. Formato esperado: CVE-YYYY-NNNNN',
      });
    }
    const filePath = path.join(OUTPUT_DIR, cveId.toUpperCase(), 'docker-compose.yml');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ erro: 'Arquivo docker-compose.yml não encontrado para este CVE.' });
        }
        return next(err);
      }
      res.setHeader('Content-Type', 'text/yaml');
      res.status(200).send(data);
    });
  } catch (erro) {
    next(erro);
  }
};

const getCveExplicacaoHtml = async (req, res, next) => {
  try {
    const { cveId } = req.params;
    if (!cveId || !cveId.match(/^CVE-\d{4}-\d+$/i)) {
      return res.status(400).json({
        erro: 'Número de CVE inválido. Formato esperado: CVE-YYYY-NNNNN',
      });
    }
    // Path: server/output/explicacoes/[CVE_ID]/explicacao-[CVE_ID_lowercase].html
    const filePath = path.join(OUTPUT_DIR, 'explicacoes', cveId.toUpperCase(), `explicacao-${cveId.toLowerCase()}.html`);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ erro: 'Arquivo de explicação HTML não encontrado para este CVE.' });
        }
        return next(err);
      }
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(data);
    });
  } catch (erro) {
    next(erro);
  }
};


const analisarCVE = async (req, res, next) => {
  try {
    const { numeroCVE } = req.params;

    if (!numeroCVE || !numeroCVE.match(/^CVE-\d{4}-\d+$/i)) {
      return res.status(400).json({
        erro: 'Número de CVE inválido. Formato esperado: CVE-YYYY-NNNNN',
      });
    }

    const resultado = await cveAnaliseServico.analisarCVECompleta(numeroCVE.toUpperCase());

    res.status(200).json({
      cve: numeroCVE.toUpperCase(),
      status: 'completo',
      resultado: resultado,
    });
  } catch (erro) {
    next(erro);
  }
};

const obterExplicacaoJSON = async (req, res, next) => {
  try {
    const { numeroCVE } = req.params;

    if (!numeroCVE || !numeroCVE.match(/^CVE-\d{4}-\d+$/i)) {
      return res.status(400).json({
        erro: 'Número de CVE inválido. Formato esperado: CVE-YYYY-NNNNN',
      });
    }

    const resultado = await cveExplicacaoServico.gerarExplicacaoCompleta(numeroCVE.toUpperCase());

    res.status(200).json({
      cve: numeroCVE.toUpperCase(),
      status: 'completo',
      resultado: resultado,
    });
  } catch (erro) {
    next(erro);
  }
};

module.exports = {
  listarCVEsExploitDB,
  // listarCVEsBancoDeDados, // Original function, replaced by getDbCves for this step
  getDbCves, // New function for mock CVE list
  analisarCVE,
  obterExplicacaoJSON,
  getCveInformacoesJson, // New
  getCveDockerCompose,   // New
  getCveExplicacaoHtml,  // New
  registrarCVE          // New
};

async function registrarCVE(req, res, next) {
  const { cveId: rawCveId } = req.params;

  if (!rawCveId || !rawCveId.match(/^CVE-\d{4}-\d+$/i)) {
    return res.status(400).json({
      erro: 'Número de CVE inválido. Formato esperado: CVE-YYYY-NNNNN',
    });
  }
  const cveId = rawCveId.toUpperCase();

  console.log(`[CVE Controller] Iniciando registro para CVE: ${cveId}`);

  try {
    // Executar análise e geração de explicação em paralelo
    const [analiseResult, explicacaoResult] = await Promise.all([
      cveAnaliseServico.analisarCVECompleta(cveId),
      cveExplicacaoServico.gerarExplicacaoCompleta(cveId)
    ]);

    // Ambos os serviços são responsáveis por salvar seus arquivos.
    // O resultado aqui pode ser apenas uma confirmação ou metadados.
    console.log(`[CVE Controller] Análise completa para ${cveId}:`, analiseResult);
    console.log(`[CVE Controller] Explicação gerada para ${cveId}:`, explicacaoResult);
    
    // Construir caminhos para os arquivos principais como exemplo de resposta
    const basePath = path.join(OUTPUT_DIR, cveId);
    const explicacaoPath = path.join(OUTPUT_DIR, 'explicacoes', cveId);

    res.status(200).json({
      mensagem: `CVE ${cveId} registrada e processada com sucesso.`,
      arquivosGerados: {
        informacoes: path.join(basePath, 'informacoes.json'),
        planoPoc: path.join(basePath, 'plano-poc.txt'),
        dockerCompose: path.join(basePath, 'docker-compose.yml'),
        explicacaoHtml: path.join(explicacaoPath, `explicacao-${cveId.toLowerCase()}.html`),
        metadadosExplicacao: path.join(explicacaoPath, 'metadados.json')
      }
    });

  } catch (erro) {
    console.error(`[CVE Controller] Erro ao registrar CVE ${cveId}:`, erro);
    // Verificar se o erro já é uma resposta HTTP (ex: de um serviço que falhou e já formatou)
    if (erro.status && erro.message) {
        return res.status(erro.status).json({ erro: erro.message });
    }
    next(erro); // Passa para o manipulador de erros global
  }
}
