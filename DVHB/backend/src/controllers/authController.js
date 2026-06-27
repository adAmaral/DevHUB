const User = require('../models/usuarios.model');

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // Se a senha estiver armazenada em hash, substituir para bcrypt.compare
    if (user.senha !== senha) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    await user.update({ data_ultimo_acesso: new Date() });

    const userData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      ativo: user.ativo,
    };

    return res.status(200).json({ user: userData });
  } catch (err) {
    next(err);
  }
};
