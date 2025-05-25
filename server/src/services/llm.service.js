require('dotenv').config();
const axios = require('axios');

class LLMServico {
  constructor() {
    this.apiUrl =
      process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
    this.apiKey = process.env.LLM_API_KEY;
    this.modelo = process.env.LLM_MODELO || 'gpt-4.1-nano';
    this.timeout = 120000;
  }

  async processarPrompt(prompt, configuracoes = {}) {
    try {
      console.log('Enviando prompt para LLM...');

      if (!this.apiKey) {
        throw new Error('Chave da API LLM não configurada');
      }

      const parametrosRequisicao = {
        model: configuracoes.modelo || this.modelo,
        messages: [
          {
            role: 'system',
            content:
              'Você é um especialista em segurança cibernética e análise de vulnerabilidades. Responda sempre em português e de forma técnica e detalhada.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: configuracoes.maxTokens || 4000,
        temperature: configuracoes.temperatura || 0.3,
        top_p: configuracoes.topP || 0.9,
      };

      const resposta = await axios.post(this.apiUrl, parametrosRequisicao, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.timeout,
      });

      if (!resposta.data.choices || resposta.data.choices.length === 0) {
        throw new Error('Resposta inválida da API LLM');
      }

      const conteudoResposta = resposta.data.choices[0].message.content;

      console.log(
        `Resposta recebida da LLM (${conteudoResposta.length} caracteres)`
      );

      return conteudoResposta;
    } catch (erro) {
      console.error('Erro ao processar prompt na LLM:', erro.message);

      if (erro.response) {
        console.error('Detalhes do erro:', erro.response.data);
      }

      throw new Error(`Falha na comunicação com LLM: ${erro.message}`);
    }
  }

  async processarPromptComContexto(
    promptPrincipal,
    contextoAdicional,
    configuracoes = {}
  ) {
    const promptCompleto = `
CONTEXTO ADICIONAL:
${contextoAdicional}

PROMPT PRINCIPAL:
${promptPrincipal}
    `;

    return await this.processarPrompt(promptCompleto, configuracoes);
  }

  async processarSequenciaPrompts(prompts, configuracoes = {}) {
    const respostas = [];

    for (let i = 0; i < prompts.length; i++) {
      console.log(`Processando prompt ${i + 1} de ${prompts.length}...`);

      const resposta = await this.processarPrompt(prompts[i], configuracoes);
      respostas.push({
        indice: i,
        prompt: prompts[i],
        resposta: resposta,
      });

      if (i < prompts.length - 1 && configuracoes.intervaloEntrePrompts) {
        await this.aguardar(configuracoes.intervaloEntrePrompts);
      }
    }

    return respostas;
  }

  async aguardar(milissegundos) {
    return new Promise((resolve) => setTimeout(resolve, milissegundos));
  }

  validarConfiguracaoAPI() {
    const problemasConfiguracao = [];

    if (!this.apiKey) {
      problemasConfiguracao.push('LLM_API_KEY não configurada');
    }

    if (!this.apiUrl) {
      problemasConfiguracao.push('LLM_API_URL não configurada');
    }

    return {
      valida: problemasConfiguracao.length === 0,
      problemas: problemasConfiguracao,
    };
  }
}

module.exports = new LLMServico();
