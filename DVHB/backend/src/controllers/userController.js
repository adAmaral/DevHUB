const { unsubscribe } = require('diagnostics_channel');
const User = require('../models/user.model');

exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    }catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    }catch (err) {
        next(err);
    }
};