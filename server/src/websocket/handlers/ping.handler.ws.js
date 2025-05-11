function manipularPing(wsCliente, dadosRecebidos) {
  console.log(`Cliente ${wsCliente.id} enviou PING:`, dadosRecebidos.dados);
  try {
    wsCliente.send(
      JSON.stringify({
        evento: 'pongServidor',
        dados: `Pong recebido de ${wsCliente.id}: ${
          dadosRecebidos.dados || 'sem dados'
        }`,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error(`Erro ao enviar pong para ${wsCliente.id}:`, error);
  }
}

module.exports = {
  manipularPing,
};
