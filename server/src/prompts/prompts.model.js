class PromptsModelo {
  obterPromptAnalisePOC(numeroCVE, informacoesCVE) {
    return `
ANÁLISE DE VULNERABILIDADE CVE: ${numeroCVE}

INFORMAÇÕES COLETADAS:
${JSON.stringify(informacoesCVE, null, 2)}

TAREFA:
Baseado nas informações fornecidas sobre a CVE ${numeroCVE}, analise detalhadamente esta vulnerabilidade e forneça um plano completo para criação de um ambiente de Proof of Concept (POC).

ESTRUTURA DA RESPOSTA ESPERADA:

1. RESUMO DA VULNERABILIDADE
   - Descrição técnica da falha
   - Componentes afetados
   - Versões vulneráveis identificadas
   - Severidade e impacto

2. COMPONENTES NECESSÁRIOS PARA POC
   - Sistema operacional base
   - Aplicações/serviços vulneráveis
   - Ferramentas de ataque
   - Dependências específicas

3. AMBIENTE DE ATAQUE
   - Configurações necessárias
   - Ferramentas específicas
   - Scripts ou exploits requeridos

4. AMBIENTE ALVO
   - Sistema/aplicação vulnerável
   - Configurações específicas
   - Versões exatas recomendadas

5. PLANO DE EXPLORAÇÃO
   - Passos detalhados para reproduzir a vulnerabilidade
   - Comandos específicos
   - Pontos de verificação

6. REQUISITOS TÉCNICOS
   - Recursos computacionais mínimos
   - Configurações de rede
   - Permissões necessárias

Seja específico e técnico. Inclua versões exatas de software quando possível e considere que o resultado será usado para gerar um docker-compose funcional.
    `;
  }

  obterPromptRefinamento(respostaAnterior, pontosFracos) {
    return `
REFINAMENTO DA ANÁLISE ANTERIOR

RESPOSTA ANTERIOR:
${respostaAnterior}

PONTOS QUE PRECISAM SER MELHORADOS:
${pontosFracos.join('\n')}

TAREFA:
Refine e complete a análise anterior, focando especificamente nos pontos fracos identificados. Mantenha as informações já corretas e adicione detalhes técnicos mais específicos onde necessário.

Certifique-se de incluir:
- Versões específicas de software
- Comandos exatos para configuração
- Detalhes técnicos sobre a exploração
- Configurações de ambiente precisas

A resposta deve ser uma versão melhorada e mais completa da análise anterior.
    `;
  }

  obterPromptDockerCompose(numeroCVE, informacoesCVE, planoPOC) {
    return `
GERAÇÃO DE DOCKER-COMPOSE PARA CVE: ${numeroCVE}

PLANO DE POC:
${planoPOC}

INFORMAÇÕES TÉCNICAS:
${JSON.stringify(informacoesCVE.dadosBasicos, null, 2)}

TAREFA:
Crie um arquivo docker-compose.yml completo e funcional que implemente o ambiente de POC descrito no plano acima.

REQUISITOS OBRIGATÓRIOS:

1. ESTRUTURA DO DOCKER-COMPOSE
   - Versão compatível (3.7 ou superior)
   - Serviços claramente definidos
   - Redes isoladas quando necessário
   - Volumes persistentes se aplicável

2. SERVIÇO DE ATAQUE
   - Container com ferramentas de pentest
   - Ambiente Kali Linux ou similar
   - Ferramentas específicas para a vulnerabilidade
   - Scripts de exploração incluídos

3. SERVIÇO ALVO
   - Aplicação/sistema vulnerável
   - Versão específica vulnerável
   - Configurações que exponham a falha
   - Dados de teste se necessário

4. CONFIGURAÇÕES DE REDE
   - Isolamento apropriado
   - Exposição de portas necessárias
   - Comunicação entre containers

5. SCRIPTS DE INICIALIZAÇÃO
   - Configuração automática dos ambientes
   - Preparação de dados de teste
   - Verificações de saúde

FORMATO DA RESPOSTA:
Forneça APENAS o conteúdo do arquivo docker-compose.yml, sem explicações adicionais. O arquivo deve ser completo e pronto para uso com 'docker-compose up'.

Inclua comentários no YAML apenas para configurações críticas.
    `;
  }

  obterPromptCorrecaoDockerCompose(dockerComposeAtual, errosEncontrados) {
    return `
CORREÇÃO DO DOCKER-COMPOSE

DOCKER-COMPOSE ATUAL:
${dockerComposeAtual}

ERROS IDENTIFICADOS:
${errosEncontrados.join('\n')}

TAREFA:
Corrija os erros identificados no docker-compose.yml mantendo toda a funcionalidade existente.

DIRETRIZES:
- Mantenha a estrutura geral
- Corrija apenas os problemas identificados
- Assegure sintaxe YAML válida
- Mantenha compatibilidade com docker-compose

FORMATO DA RESPOSTA:
Forneça APENAS o arquivo docker-compose.yml corrigido, sem explicações adicionais.
    `;
  }

  obterPromptAnaliseComplexidade(numeroCVE, informacoesCVE) {
    return `
ANÁLISE DE COMPLEXIDADE DA CVE: ${numeroCVE}

INFORMAÇÕES:
${JSON.stringify(informacoesCVE, null, 2)}

TAREFA:
Avalie a complexidade de implementação desta CVE e classifique-a:

1. COMPLEXIDADE TÉCNICA (1-5):
   - Facilidade de reprodução
   - Requisitos técnicos
   - Conhecimento necessário

2. RECURSOS NECESSÁRIOS (1-5):
   - Poder computacional
   - Ferramentas específicas
   - Tempo de configuração

3. VIABILIDADE DO POC (1-5):
   - Disponibilidade de exploits
   - Documentação existente
   - Estabilidade da exploração

Forneça uma pontuação de 1 (mais simples) a 5 (mais complexo) para cada categoria e justifique brevemente.
    `;
  }
}

module.exports = new PromptsModelo();
