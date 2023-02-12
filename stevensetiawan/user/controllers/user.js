"use strict"
const { User } = require('../models')
const bcrypt = require("../helpers/bcrypt")

exports.getUserbyIdentityNumber = async (req, res) => {
  try {
    const identityNumber = req.params.identityNumber
    const result = await User.findOne({identityNumber})
    if (!result) {
      return res.status(404).send({
        message: "User is not found"
      })
    } else {
      return res.status(200).send(result)
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data by id"
    })
  }
}

exports.getUserbyAccountNumber = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber

    const result = await User.findOne({accountNumber})

    if (!result) {
      return res.status(404).send({
        message: "User is not found"
      })
    } else {
      return res.status(200).send(result)
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data by id"
    })
  }
}

exports.getUsers = async (req, res) => {
  try {
    const result = await User.find().sort({
      updatedAt: -1
    })

    return res.status(200).send(result)

  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data"
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const identityNumber = req.params.identityNumber
      
    const user_payload = {
      userName: req.body.userName,
      identityNumber: req.body.identityNumber,
      accountNumber: req.body.accountNumber,
      password: req.body.password,
      emailAddress: req.body.emailAddress,
    }

    const result = await User.findOneAndUpdate(
      {identityNumber}, user_payload, {
        returnOriginal: false
      }
    )

    if (!result) {
      throw new Error('User is not found!')
    } else {
      return res.status(200).send({
        message: "User is updated",
        data: result
      })
    }
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to update User"
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const identityNumber = req.params.identityNumber
    const result = await User.findOneAndRemove({identityNumber})

    if (!result) {
      return res.status(404).send({
        message: "User is not found"
      })
    } else {
      return res.status(200).send({
        message: "User is deleted"
      })
    }
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to delete User"
    })
  }
}