"use strict"
const dbConfig = require('../config/db.config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const db = {
  mongoose : mongoose,
  url : dbConfig.url,
  User :require("./user")(mongoose),
}

module.exports = db