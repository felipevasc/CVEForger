// src/config/websocket.config.js
const WebSocket = require('ws');
const http = require('http');
const { portaWs } = require('./ambiente');
const { registrarEventosWebSocket } = require('../websocket/routes.ws');

let wssInstancia;

function iniciarServidorWebSocket(servidorHttp) {
  const wss = new WebSocket.Server({ server: servidorHttp });
  wssInstancia = wss;

  wss.on('connection', (wsCliente, requisicao) => {
    console.log(
      'Cliente WebSocket conectado:',
      requisicao.socket.remoteAddress
    );

    wsCliente.id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    console.log(`Cliente ${wsCliente.id} conectado.`);

    registrarEventosWebSocket(wsCliente, wss); // Passa wss para permitir broadcast

    wsCliente.on('close', () => {
      console.log(`Cliente WebSocket ${wsCliente.id} desconectado.`);
    });

    wsCliente.on('error', (erro) => {
      console.error(`Erro no WebSocket do cliente ${wsCliente.id}:`, erro);
    });
  });

  console.log(
    `Servidor WebSocket escutando na porta ${portaWs} (compartilhada com HTTP)`
  );
  return wss;
}

// Função para obter a instância do WSS (útil para broadcast de fora dos manipuladores diretos)
function obterWssInstancia() {
  if (!wssInstancia) {
    throw new Error('Servidor WebSocket não foi inicializado.');
  }
  return wssInstancia;
}

module.exports = {
  iniciarServidorWebSocket,
  obterWssInstancia,
};
