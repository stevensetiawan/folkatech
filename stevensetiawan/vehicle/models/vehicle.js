"use strict"
const mongoose = require('mongoose')
const {
  Schema
} = mongoose
const bcrypt = require("../helpers/bcrypt")
module.exports = (mongoose) => {
  const schema = Schema({
    brand: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true,
    },
    policeNo: {
      type: String,
      required: true,
      index: {
        unique: true,
        sparse: true
      }
    }
  }, {
    timestamps: true
  })

  schema.method("toJSON", function(){
    const{__v, _id, ...object} = this.toObject()
    object.id = _id
    return object
  })

  const Vehicle = mongoose.model("vehicles", schema)
  return Vehicle
}