const exploitDBServico = require('../../services/exploit-db.service');
const cveAnaliseServico = require('../../services/cve-analise.service');
const cveExplicacaoServico = require('../../services/cve-explicacao.service');

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

const listarCVEsBancoDeDados = async (req, res, next) => {
  try {
    const cves = [];
    res.status(200).json({
      fonte: 'Exploit-DB (via banco de dados)',
      totalCVEs: cves.length,
      cves: cves,
      dataAtualizacaoCSVPrevista: 'Diária (pelo Exploit-DB)',
    });
  } catch (erro) {
    next(erro);
  }
};

const analisarCVE = async (req, res, next) => {
  try {
    const { numeroCVE } = req.params;

    if (!numeroCVE || !numeroCVE.match(/^CVE-\d{4}-\d+$/)) {
      return res.status(400).json({
        erro: 'Número de CVE inválido. Formato esperado: CVE-YYYY-NNNNN',
      });
    }

    const resultado = await cveAnaliseServico.analisarCVECompleta(numeroCVE);

    res.status(200).json({
      cve: numeroCVE,
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

    if (!numeroCVE || !numeroCVE.match(/^CVE-\d{4}-\d+$/)) {
      return res.status(400).json({
        erro: 'Número de CVE inválido. Formato esperado: CVE-YYYY-NNNNN',
      });
    }

    const resultado = await cveExplicacaoServico.gerarExplicacaoCompleta(numeroCVE);

    res.status(200).json({
      cve: numeroCVE,
      status: 'completo',
      resultado: resultado,
    });
  } catch (erro) {
    next(erro);
  }
};

module.exports = {
  listarCVEsExploitDB,
  listarCVEsBancoDeDados,
  analisarCVE,
  obterExplicacaoJSON
};
