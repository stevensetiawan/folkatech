"use strict"
const dbConfig = require('../config/db.config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const db = {
  mongoose : mongoose,
  url : dbConfig.url,
  Vehicle :require("./vehicle")(mongoose),
}

module.exports = db