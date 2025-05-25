require('dotenv').config();
const http = require('http');
const app = require('./app');
const { portaHttp } = require('./config/ambiente');
const { iniciarServidorWebSocket } = require('./config/websocket.config');

const servidorHttp = http.createServer(app);

const wss = iniciarServidorWebSocket(servidorHttp);

servidorHttp.listen(portaHttp, () => {
  console.log(process.env);
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
