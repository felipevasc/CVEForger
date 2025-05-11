const WebSocket = require('ws'); // Necessário para wss.clients

function manipularMensagemUsuario(wsCliente, dadosRecebidos, wss) {
  const { usuario, texto } = dadosRecebidos.dados;
  if (!usuario || !texto) {
    console.warn(
      `Cliente ${wsCliente.id} enviou mensagem inválida:`,
      dadosRecebidos
    );
    try {
      wsCliente.send(
        JSON.stringify({
          evento: 'erroMensagem',
          dados:
            'Formato de mensagem inválido. "usuario" e "texto" são obrigatórios.',
        })
      );
    } catch (error) {
      console.error(
        `Erro ao enviar erro de mensagem para ${wsCliente.id}:`,
        error
      );
    }
    return;
  }

  console.log(
    `Cliente <span class="math-inline">\{wsCliente\.id\} \(</span>{usuario}) enviou mensagem: ${texto}`
  );

  const mensagemParaBroadcast = {
    evento: 'novaMensagem',
    dados: {
      idRemetente: wsCliente.id,
      usuario: usuario,
      texto: texto,
      timestamp: new Date().toISOString(),
    },
  };

  // Broadcast para todos os clientes conectados, incluindo o remetente
  wss.clients.forEach((cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      try {
        cliente.send(JSON.stringify(mensagemParaBroadcast));
      } catch (error) {
        console.error(
          `Erro ao transmitir mensagem para cliente ${cliente.id}:`,
          error
        );
      }
    }
  });
}

module.exports = {
  manipularMensagemUsuario,
};
