"use strict"
const { Vehicle } = require('../models')

exports.getVehicles = async (req, res) => {
  try {

    const result = await Vehicle.find().sort({
      updatedAt: -1
    })

    return res.status(200).send(result)

  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data"
    })
  }
}

exports.getVehicleByPoliceNo = async (req, res) => {
  try {
    const policeNo = req.params.policeNo

    const result = await Vehicle.findOne({policeNo})

    if (!result) {
      return res.status(404).send({
        message: "Vehicle is not found"
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

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({
      brand: req.body.brand,
      color: req.body.color,
      policeNo: req.body.policeNo
    })

    const result = await Vehicle.create(vehicle)

    return res.status(201).send(result)

  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to create package"
    })
  }
}

exports.updateVehicle = async (req, res) => {
  try {
    const policeNo = req.params.policeNo
   
    const vehicle_payload = {
      brand: req.body.brand,
      color: req.body.color,
      policeNo: req.body.policeNo
    }

    const result = await Vehicle.findOneAndUpdate(
      {policeNo}, vehicle_payload, {
        returnOriginal: false
      }
    )

    if (!result) {
      throw new Error('Vehicle is not found!')
    } else {
      return res.status(200).send({
        message: "Vehicle is updated",
        data: result
      })
    }
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to update Vehicle"
    })
  }
}

exports.deleteVehicle = async (req, res) => {
  try {
    const policeNo = req.params.policeNo
    const result = await Vehicle.findOneAndRemove({policeNo})

    if (!result) {
      return res.status(404).send({
        message: "Vehicle is not found"
      })
    } else {
      return res.status(200).send({
        message: `Vehicle ${policeNo} is deleted`
      })
    }
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to delete Vehicle"
    })
  }
}