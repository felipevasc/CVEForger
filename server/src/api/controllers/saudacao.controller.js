const obterSaudacao = (req, res) => {
  const nome = req.query.nome || 'Mundo';
  res.status(200).json({ mensagem: `Olá, ${nome}! Bem-vindo(a) à nossa API.` });
};

const obterDespedida = (req, res) => {
  res.status(200).json({ mensagem: 'Até logo! Obrigado por usar nossa API.' });
};

module.exports = {
  obterSaudacao,
  obterDespedida,
};
