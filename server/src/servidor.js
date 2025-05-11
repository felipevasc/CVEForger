const http = require('http');
const app = require('./app'); // Importa a instância configurada do Express
const { portaHttp } = require('./config/ambiente');
const { iniciarServidorWebSocket } = require('./config/websocket.config');

// Cria o servidor HTTP usando a aplicação Express
const servidorHttp = http.createServer(app);

// Inicia o servidor WebSocket, anexando-o ao servidor HTTP
const wss = iniciarServidorWebSocket(servidorHttp);

servidorHttp.listen(portaHttp, () => {
  console.log(`Servidor HTTP rodando em http://localhost:${portaHttp}`);
  console.log(
    `Servidor WebSocket também disponível (compartilhando a porta ${portaHttp} com HTTP).`
  );
  console.log('---');
  console.log('Exemplos de endpoints da API:');
  console.log(
    `  GET  http://localhost:${portaHttp}/api/saudacoes/ola?nome=Usuario`
  );
  console.log(`  GET  http://localhost:${portaHttp}/api/saudacoes/tchau`);
  console.log(
    `  POST http://localhost:${portaHttp}/api/dados/enviar (corpo: {"id": "item1", "valor": 100})`
  );
  console.log(`  GET  http://localhost:${portaHttp}/api/dados/listar`);
  console.log('---');
  console.log(
    'Para testar o WebSocket, abra o arquivo public/index.html no seu navegador.'
  );
});

// Lidar com o encerramento gracioso (opcional, mas bom para produção)
process.on('SIGTERM', () => {
  console.info('Sinal SIGTERM recebido. Fechando servidor HTTP e WebSocket...');
  wss.close(() => {
    console.log('Servidor WebSocket fechado.');
  });
  servidorHttp.close(() => {
    console.log('Servidor HTTP fechado.');
    process.exit(0);
  });
});
