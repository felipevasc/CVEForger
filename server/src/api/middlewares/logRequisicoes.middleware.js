const logRequisicoes = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url, ip } = req;
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next(); // Chama o próximo middleware ou rota
};

module.exports = logRequisicoes;
