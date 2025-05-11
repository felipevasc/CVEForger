const exploitDBServico = require('../../services/exploit-db.service');

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
    // O erro já foi logado no serviço, aqui apenas passamos para o middleware de erro
    next(erro); // Passa o erro para o manipulador de erros global
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
    // O erro já foi logado no serviço, aqui apenas passamos para o middleware de erro
    next(erro); // Passa o erro para o manipulador de erros global
  }
};

module.exports = {
  listarCVEsExploitDB,
  listarCVEsBancoDeDados,
};
