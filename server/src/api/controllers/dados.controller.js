let dadosArmazenados = []; // Simples armazenamento em memória para exemplo

const receberDados = (req, res) => {
  const { id, valor } = req.body;

  if (!id || valor === undefined) {
    return res
      .status(400)
      .json({ mensagem: 'Os campos "id" e "valor" são obrigatórios.' });
  }

  const novoDado = { id, valor, recebidoEm: new Date().toISOString() };
  dadosArmazenados.push(novoDado);

  console.log('Dados recebidos:', novoDado);
  res
    .status(201)
    .json({ mensagem: 'Dados recebidos com sucesso!', dado: novoDado });
};

const listarDados = (req, res) => {
  res
    .status(200)
    .json({ total: dadosArmazenados.length, dados: dadosArmazenados });
};

module.exports = {
  receberDados,
  listarDados,
};
