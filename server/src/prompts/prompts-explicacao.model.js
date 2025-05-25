class PromptsExplicacaoModelo {
  obterPromptExplicacaoInicial(
    numeroCVE,
    informacoesCVE,
    pocsGithub,
    exploitsDB
  ) {
    return `
Você é um especialista em segurança cibernética responsável por criar explicações educativas sobre vulnerabilidades CVE.

TAREFA: Criar uma página HTML interativa e educativa sobre a CVE ${numeroCVE}

INFORMAÇÕES DA CVE:
- Número: ${numeroCVE}
- Descrição: ${informacoesCVE.descricao}
- Severidade: ${
      informacoesCVE.severidade
        ? `${informacoesCVE.severidade.severidade} (${informacoesCVE.severidade.pontuacaoBase}/10)`
        : 'Não disponível'
    }
- Vetor de Ataque: ${
      informacoesCVE.vetorAtaque
        ? JSON.stringify(informacoesCVE.vetorAtaque, null, 2)
        : 'Não disponível'
    }
- Produtos Afetados: ${
      informacoesCVE.produtosAfetados.length > 0
        ? informacoesCVE.produtosAfetados
            .map(
              (p) =>
                `${p.produto?.fornecedor}/${p.produto?.produto} ${p.produto?.versao}`
            )
            .join(', ')
        : 'Não especificado'
    }

POCS ENCONTRADAS NO GITHUB:
${
  pocsGithub.length > 0
    ? pocsGithub
        .map(
          (poc) => `
- Repositório: ${poc.nomeCompleto}
- Descrição: ${poc.descricao}
- Linguagem: ${poc.linguagem}
- URL: ${poc.urlHTML}
- README: ${
            poc.conteudoReadme
              ? poc.conteudoReadme.substring(0, 500) + '...'
              : 'Não disponível'
          }
`
        )
        .join('\n')
    : 'Nenhuma POC encontrada no GitHub'
}

EXPLOITS DO EXPLOIT-DB:
${
  exploitsDB.length > 0
    ? exploitsDB
        .map(
          (exploit) => `
- ID: ${exploit.id}
- Título: ${exploit.titulo}
- Tipo: ${exploit.tipo}
- Plataforma: ${exploit.plataforma}
- Data: ${exploit.data}
- Autor: ${exploit.autor}
- Código: ${
            exploit.codigo
              ? exploit.codigo.substring(0, 1000) + '...'
              : 'Não disponível'
          }
`
        )
        .join('\n')
    : 'Nenhum exploit encontrado no Exploit-DB'
}

REQUISITOS PARA A PÁGINA HTML:
1. Deve ser uma página HTML completa, autocontida, com CSS e JavaScript incorporados
2. Design moderno e responsivo usando técnicas CSS avançadas
3. Estrutura em 3 níveis de explicação (Alto, Médio, Baixo)
4. Elementos interativos para facilitar a compreensão
5. Visualizações gráficas quando aplicável
6. Código de exemplo quando relevante
7. Seção de riscos e impactos
8. Timeline ou fluxo de exploração
9. Seção de mitigação e proteção

ESTRUTURA ESPERADA:
- Header com informações básicas da CVE
- Seção de explicação em Alto Nível (analogias, visão macro)
- Seção de explicação em Médio Nível (detalhes técnicos)
- Seção de explicação em Baixo Nível (passos detalhados, comandos)
- Seção de riscos e impactos
- Seção de mitigação
- Footer com referências

IMPORTANTE:
- Use apenas bibliotecas disponíveis via CDN (Chart.js, highlight.js, etc.)
- Torne a explicação didática e acessível
- Inclua diagramas visuais quando possível
- Use animações CSS para tornar interativo
- Mantenha o foco educativo, não forneça ferramentas maliciosas

Gere APENAS o código HTML completo, sem explicações adicionais.`;
  }

  obterPromptRefinamentoExplicacao(htmlAtual, pontosFracos) {
    return `
Você precisa melhorar a página HTML explicativa da CVE baseada nos seguintes pontos fracos identificados:

PONTOS FRACOS ENCONTRADOS:
${pontosFracos.join('\n- ')}

HTML ATUAL:
${htmlAtual}

INSTRUÇÕES:
1. Corrija todos os pontos fracos identificados
2. Mantenha a estrutura existente mas aprimore o conteúdo
3. Adicione mais interatividade se necessário
4. Melhore as explicações técnicas
5. Garanta que todas as seções estejam completas

Gere APENAS o código HTML completo corrigido, sem explicações adicionais.`;
  }

  obterPromptValidacaoFinal(htmlGerado, numeroCVE) {
    return `
Analise a página HTML explicativa da CVE ${numeroCVE} e verifique se:

HTML PARA ANÁLISE:
${htmlGerado.substring(0, 2000)}...

CRITÉRIOS DE VALIDAÇÃO:
1. Contém explicação em 3 níveis (Alto, Médio, Baixo)
2. Tem seções de riscos e mitigação
3. Inclui elementos interativos
4. Usa design responsivo
5. Contém informações técnicas precisas
6. É educativo e didático
7. Não contém código malicioso
8. Usa bibliotecas CDN adequadas

Responda APENAS:
VALIDO: SIM/NAO
PONTOS_FRACOS: [lista dos problemas encontrados]
SUGESTOES: [sugestões de melhoria]`;
  }

  obterPromptEnriquecimentoTecnico(htmlAtual, informacoesAdicionais) {
    return `
Enriqueça a página HTML com as seguintes informações técnicas adicionais:

INFORMAÇÕES ADICIONAIS:
${informacoesAdicionais}

HTML ATUAL:
${htmlAtual}

INSTRUÇÕES:
1. Integre as novas informações técnicas nas seções apropriadas
2. Adicione mais detalhes sobre a exploração
3. Inclua comandos e exemplos práticos quando relevante
4. Melhore as visualizações gráficas
5. Adicione mais elementos interativos

Gere APENAS o código HTML completo enriquecido.`;
  }
}

module.exports = new PromptsExplicacaoModelo();
