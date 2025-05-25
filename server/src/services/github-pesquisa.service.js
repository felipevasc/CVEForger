const axios = require('axios');

class GithubPesquisaServico {
  constructor() {
    this.urlBaseAPI = 'https://api.github.com';
    this.tokenGithub = process.env.GITHUB_TOKEN;
    this.timeout = 30000;
    this.limitePorPagina = 30;
    this.maxPaginas = 3;
  }

  async buscarPOCsNoGithub(numeroCVE) {
    try {
      console.log(`Buscando POCs no GitHub para CVE: ${numeroCVE}`);

      const termosPermutacao = this.gerarTermosPesquisa(numeroCVE);
      const resultadosConsolidados = [];

      for (const termo of termosPermutacao) {
        const resultados = await this.buscarRepositorios(termo);
        resultadosConsolidados.push(...resultados);

        await this.aguardarLimiteAPI();
      }

      const resultadosUnicos = this.removerDuplicatas(resultadosConsolidados);
      const resultadosDetalhados = await this.obterDetalhesRepositorios(
        resultadosUnicos
      );

      return this.classificarResultados(resultadosDetalhados);
    } catch (erro) {
      console.error(`Erro ao buscar POCs no GitHub: ${erro.message}`);
      return [];
    }
  }

  gerarTermosPesquisa(numeroCVE) {
    const numeroLimpo = numeroCVE.replace('CVE-', '');

    return [
      `${numeroCVE} POC`,
      `${numeroCVE} exploit`,
      `${numeroCVE} vulnerability`,
      `CVE-${numeroLimpo} proof`,
      `${numeroLimpo} POC`,
      `${numeroCVE} demonstration`,
      `${numeroCVE} reproduction`,
    ];
  }

  async buscarRepositorios(termoPesquisa) {
    try {
      const cabecalhos = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'CVE-Analysis-Tool/1.0',
      };

      if (this.tokenGithub) {
        cabecalhos['Authorization'] = `token ${this.tokenGithub}`;
      }

      const resposta = await axios.get(
        `${this.urlBaseAPI}/search/repositories`,
        {
          params: {
            q: termoPesquisa,
            sort: 'stars',
            order: 'desc',
            per_page: this.limitePorPagina,
          },
          headers: cabecalhos,
          timeout: this.timeout,
        }
      );

      return resposta.data.items || [];
    } catch (erro) {
      console.warn(`Erro na busca por "${termoPesquisa}": ${erro.message}`);
      return [];
    }
  }

  async obterDetalhesRepositorios(repositorios) {
    const repositoriosDetalhados = [];

    for (const repo of repositorios.slice(0, 20)) {
      try {
        const detalhes = await this.obterDetalhesRepositorio(repo);
        repositoriosDetalhados.push(detalhes);

        await this.aguardarLimiteAPI();
      } catch (erro) {
        console.warn(
          `Erro ao obter detalhes do repositório ${repo.full_name}: ${erro.message}`
        );
      }
    }

    return repositoriosDetalhados;
  }

  async obterDetalhesRepositorio(repositorioBasico) {
    try {
      const cabecalhos = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'CVE-Analysis-Tool/1.0',
      };

      if (this.tokenGithub) {
        cabecalhos['Authorization'] = `token ${this.tokenGithub}`;
      }

      const [dadosRepo, arquivos, commits] = await Promise.all([
        axios.get(repositorioBasico.url, {
          headers: cabecalhos,
          timeout: this.timeout,
        }),
        this.obterArquivosRepositorio(repositorioBasico.full_name, cabecalhos),
        this.obterCommitsRecentes(repositorioBasico.full_name, cabecalhos),
      ]);

      return {
        ...repositorioBasico,
        detalhes: dadosRepo.data,
        arquivos: arquivos,
        commits: commits,
        relevancia: this.calcularRelevancia(repositorioBasico, arquivos),
      };
    } catch (erro) {
      return {
        ...repositorioBasico,
        erro: erro.message,
        relevancia: 0,
      };
    }
  }

  async obterArquivosRepositorio(nomeCompleto, cabecalhos) {
    try {
      const resposta = await axios.get(
        `${this.urlBaseAPI}/repos/${nomeCompleto}/contents`,
        {
          headers: cabecalhos,
          timeout: this.timeout,
        }
      );

      const arquivos = resposta.data.filter((item) => item.type === 'file');
      const arquivosRelevantes = [];

      for (const arquivo of arquivos.slice(0, 10)) {
        if (this.ehArquivoRelevante(arquivo.name)) {
          try {
            const conteudo = await this.obterConteudoArquivo(
              nomeCompleto,
              arquivo.path,
              cabecalhos
            );
            arquivosRelevantes.push({
              nome: arquivo.name,
              caminho: arquivo.path,
              tamanho: arquivo.size,
              conteudo: conteudo.substring(0, 1000),
            });
          } catch (erro) {
            arquivosRelevantes.push({
              nome: arquivo.name,
              caminho: arquivo.path,
              tamanho: arquivo.size,
              erro: erro.message,
            });
          }
        }
      }

      return arquivosRelevantes;
    } catch (erro) {
      return [];
    }
  }

  async obterConteudoArquivo(nomeCompleto, caminhoArquivo, cabecalhos) {
    const resposta = await axios.get(
      `${this.urlBaseAPI}/repos/${nomeCompleto}/contents/${caminhoArquivo}`,
      {
        headers: cabecalhos,
        timeout: this.timeout,
      }
    );

    if (resposta.data.content) {
      return Buffer.from(resposta.data.content, 'base64').toString('utf-8');
    }

    return '';
  }

  async obterCommitsRecentes(nomeCompleto, cabecalhos) {
    try {
      const resposta = await axios.get(
        `${this.urlBaseAPI}/repos/${nomeCompleto}/commits`,
        {
          params: { per_page: 5 },
          headers: cabecalhos,
          timeout: this.timeout,
        }
      );

      return resposta.data.map((commit) => ({
        sha: commit.sha,
        mensagem: commit.commit.message,
        data: commit.commit.author.date,
        autor: commit.commit.author.name,
      }));
    } catch (erro) {
      return [];
    }
  }

  ehArquivoRelevante(nomeArquivo) {
    const extensoesRelevantes = [
      '.py',
      '.sh',
      '.rb',
      '.pl',
      '.c',
      '.cpp',
      '.java',
      '.js',
      '.go',
    ];
    const nomesRelevantes = [
      'readme',
      'exploit',
      'poc',
      'payload',
      'attack',
      'vuln',
    ];

    const extensaoRelevante = extensoesRelevantes.some((ext) =>
      nomeArquivo.toLowerCase().endsWith(ext)
    );

    const nomeRelevante = nomesRelevantes.some((nome) =>
      nomeArquivo.toLowerCase().includes(nome)
    );

    return (
      extensaoRelevante ||
      nomeRelevante ||
      nomeArquivo.toLowerCase().includes('docker')
    );
  }

  calcularRelevancia(repositorio, arquivos) {
    let pontuacao = 0;

    pontuacao += repositorio.stargazers_count || 0;
    pontuacao += (repositorio.forks_count || 0) * 2;
    pontuacao += arquivos.length * 5;

    if (repositorio.description) {
      const descricaoLower = repositorio.description.toLowerCase();
      if (descricaoLower.includes('poc')) pontuacao += 10;
      if (descricaoLower.includes('exploit')) pontuacao += 10;
      if (descricaoLower.includes('vulnerability')) pontuacao += 5;
    }

    const temArquivosPOC = arquivos.some(
      (arquivo) =>
        arquivo.nome.toLowerCase().includes('poc') ||
        arquivo.nome.toLowerCase().includes('exploit')
    );

    if (temArquivosPOC) pontuacao += 15;

    return pontuacao;
  }

  classificarResultados(repositorios) {
    return repositorios
      .sort((a, b) => (b.relevancia || 0) - (a.relevancia || 0))
      .map((repo, indice) => ({
        posicao: indice + 1,
        nome: repo.full_name,
        url: repo.html_url,
        descricao: repo.description,
        estrelas: repo.stargazers_count,
        forks: repo.forks_count,
        linguagem: repo.language,
        ultimaAtualizacao: repo.updated_at,
        relevancia: repo.relevancia,
        arquivos: repo.arquivos || [],
        commits: repo.commits || [],
      }));
  }

  removerDuplicatas(repositorios) {
    const repositoriosUnicos = new Map();

    repositorios.forEach((repo) => {
      if (!repositoriosUnicos.has(repo.id)) {
        repositoriosUnicos.set(repo.id, repo);
      }
    });

    return Array.from(repositoriosUnicos.values());
  }

  async aguardarLimiteAPI() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

module.exports = new GithubPesquisaServico();
