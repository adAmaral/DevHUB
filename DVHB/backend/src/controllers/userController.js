const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios.model');

exports.createUser = async (req, res, next) => {
    try {
        const usuario = await Usuario.create(req.body);
        return res.status(201).json(usuario);
    } catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const usuarios = await Usuario.findAll();
        return res.json(usuarios);
    } catch (err) {
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario_id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        return res.json(usuario);
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { nome, telefone, foto_perfil } = req.body;

        const usuario = await Usuario.findByPk(req.usuario_id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        await usuario.update({ nome, telefone, foto_perfil });
        return res.json(usuario);
    } catch (err) {
        next(err);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const { senha_atual, nova_senha } = req.body;

        if (!senha_atual || !nova_senha) {
            return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
        }

        // Busca o usuário com a senha para comparação
        const usuario = await Usuario.scope('withPassword').findByPk(req.usuario_id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senha_atual, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha atual incorreta.' });
        }

        await usuario.update({ senha: nova_senha });
        return res.json({ message: 'Senha atualizada com sucesso.' });
    } catch (err) {
        next(err);
    }
};
