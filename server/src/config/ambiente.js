require('dotenv').config();

module.exports = {
  portaHttp: process.env.PORTA_HTTP || 3000,
  portaWs: process.env.PORTA_WS || 3001,
  ambiente: process.env.AMBIENTE || 'desenvolvimento',
};
