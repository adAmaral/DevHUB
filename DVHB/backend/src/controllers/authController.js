const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios.model');
const SessoesUsuario = require('../models/sessoes_usuario.model');

exports.login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
        }

        // Busca o usuário incluindo a senha (fora do defaultScope)
        const usuario = await Usuario.scope('withPassword').findOne({ where: { email } });

        if (!usuario || !usuario.ativo) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // Registra a sessão no banco de dados
        await SessoesUsuario.create({
            usuario_id: usuario.id,
            token_sessao: token,
            ip_address: req.ip,
            user_agent: req.headers['user-agent'] || null,
            data_expiracao: new Date(Date.now() + 3600 * 1000),
        });

        await usuario.update({ data_ultimo_acesso: new Date() });

        return res.status(200).json({
            token,
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                foto_perfil: usuario.foto_perfil,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            await SessoesUsuario.update(
                { ativo: false },
                { where: { token_sessao: token } }
            );
        }
        return res.status(200).json({ message: 'Logout realizado com sucesso.' });
    } catch (err) {
        next(err);
    }
};
