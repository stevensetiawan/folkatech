"use strict"
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hasher = (password) => {
    return bcrypt.hashSync(password, saltRounds);
}

exports.checker = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}