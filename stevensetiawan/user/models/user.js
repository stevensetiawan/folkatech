"use strict"
const mongoose = require('mongoose')
const {
  Schema
} = mongoose
const bcrypt = require("../helpers/bcrypt")
module.exports = (mongoose) => {
  const schema = Schema({
    userName: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true,
      index: {
        unique: true,
        sparse: true
      }
    },
    emailAddress: {
      type: String,
      required: true,
      index: {
        unique: true,
        sparse: true
      }
    },
    password: {
      type: String,
      required: true
    },
    identityNumber: {
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

  schema.pre('save', async function (done) {
    if (this.isModified('password')) {
      const hashed = await bcrypt.hasher(this.get("password"))
      this.set("password", hashed)
    }
    done()
  })

  schema.methods.isValidPassword = async function (password, user_password) {
    const compare = await bcrypt.checker(password, user_password)
    return compare
  }

  schema.method("toJSON", function () {
    const {
      __v,
      _id,
      ...object
    } = this.toObject()
    object.id = _id
    return object
  })

  const User = mongoose.model("users", schema)
  return User
}