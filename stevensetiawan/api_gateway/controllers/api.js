"use strict"
const bcrypt = require("../helpers/bcrypt")
const axios = require('axios');
const redis_connector = require('../helpers/redis_connector');
const { stringify } = require("querystring");

exports.getUserbyIdentityNumber = async (req, res) => {
  try {
    let [token, err] = await redis_connector.get('token')

    let userInstance = axios.create({
      baseURL: 'http://localhost:3002/api/v1/user',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    const identityNumber = req.params.identityNumber
    const { data: response } = await userInstance.get(
      `/identityNumber/${identityNumber}`
    );    
      if (!response) {
        return res.status(404).send({
          message: "User is not found"
        })
      } else {
        return res.status(200).send(response)
      }
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data by id"
    })
  }
}

exports.getUserbyAccountNumber = async (req, res) => {
  try {
    let [token, err] = await redis_connector.get('token')

    let userInstance = axios.create({
      baseURL: 'http://localhost:3002/api/v1/user',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    const accountNumber = req.params.accountNumber
    const { data: response } = await userInstance.get(
      `/accountNumber/${accountNumber}`
    );     
    if (!response) {
      return res.status(404).send({
        message: "User is not found"
      })
    } else {
      return res.status(200).send(response)
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data by id"
    })
  }
}

exports.getUsers = async (req, res) => {
  try {
    let [token, err] = await redis_connector.get('token')

    let userInstance = axios.create({
      baseURL: 'http://localhost:3002/api/v1/user',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const { data: response } = await userInstance.get(
      `/`
    );     

    return res.status(200).send(response)
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data"
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const identityNumber = req.params.identityNumber
    let hashed = ''
    if(req.body.password && req.body.password.trim().length > 0) {
      hashed = await bcrypt.hasher(req.body.password)
    }    
    const user_payload = {
      userName: req.body.userName,
      identityNumber: req.body.identityNumber,
      accountNumber: req.body.accountNumber,
      password: hashed,
      emailAddress: req.body.emailAddress,
    }

    let [token, err] = await redis_connector.get('token')
    
    let userInstance = axios.create({
      baseURL: 'http://localhost:3002/api/v1/user',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const { data: response } = await userInstance.put(
      `/${identityNumber}`,
      user_payload
    );

    return res.status(200).send({
      response
    })

  } catch (err) {
    return res.status(409).send({
      message: err.response.data.message || err.message || "Error to update occured"
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const identityNumber = req.params.identityNumber
    let [token, err] = await redis_connector.get('token')
    let userInstance = axios.create({
      baseURL: 'http://localhost:3002/api/v1/user',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const { data: response } = await userInstance.delete(
      `/${identityNumber}`
    );

    return res.status(200).send({
      message: `User ${identityNumber} is deleted`
    })

  } catch (err) {
    return res.status(409).send({
      message: err.response.data.message || err.message || "Error to delete user"
    })
  }
}

exports.getVehicles = async (req, res) => {
  try {
    let [token, err] = await redis_connector.get('token')

    let vehicleInstance = axios.create({
      baseURL: 'http://localhost:3001/api/v1/vehicle',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const { data: response } = await vehicleInstance.get(
      `/`
    );

    if(response){
      await redis_connector.set('vehicles', JSON.stringify(response), 600000)
      let [vehiclez, err] = await redis_connector.get('vehicles')
    }

    return res.status(200).send(response)
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data"
    })
  }
}

exports.getVehicleByPoliceNo = async (req, res) => {
  try {
    let [token, err] = await redis_connector.get('token')

    let vehicleInstance = axios.create({
      baseURL: 'http://localhost:3001/api/v1/vehicle',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    const policeNo = req.params.policeNo
    const { data: response } = await vehicleInstance.get(
      `/${policeNo}`
    );
        if (!response) {
      return res.status(404).send({
        message: "Vehicle is not found"
      })
    } else {
      return res.status(200).send(response)
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data by id"
    })
  }
}

exports.updateVehicle = async (req, res) => {
  try {
    const identityNumber = req.params.identityNumber
   
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

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = {
      brand: req.body.brand,
      color: req.body.color,
      policeNo: req.body.policeNo
    }
    let [token, err] = await redis_connector.get('token')
    let vehicleInstance = axios.create({
      baseURL: 'http://localhost:3001/api/v1/vehicle',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const { data: response } = await vehicleInstance.post(
      `/`,
      vehicle
    );

    if(response){
      let [vehicles, err] = await redis_connector.get('vehicles')
      let arr_vehicle = JSON.parse(vehicles)
      arr_vehicle.unshift(response)
      await redis_connector.set('vehicles', JSON.stringify(arr_vehicle), 600000)
    }

    return res.status(201).send(response)
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

    let [token, err] = await redis_connector.get('token')
    let vehicleInstance = axios.create({
      baseURL: 'http://localhost:3001/api/v1/vehicle',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const { data: response } = await vehicleInstance.put(
      `/${policeNo}`,
      vehicle_payload
    );
    if(response){
      let [vehicles, err] = await redis_connector.get('vehicles')
      let arr_vehicle = JSON.parse(vehicles)
      let update_obj = arr_vehicle.findIndex((obj => obj.policeNo === req.body.policeNo));
      arr_vehicle[update_obj].brand = req.body.brand
      arr_vehicle[update_obj].color = req.body.color
      arr_vehicle[update_obj].policeNo = req.body.policeNo
      await redis_connector.set('vehicles', JSON.stringify(arr_vehicle), 600000)
    }

    return res.status(200).send(response)
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to update Vehicle"
    })
  }
}

exports.deleteVehicle = async (req, res) => {
  try {
    const policeNo = req.params.policeNo
    let [token, err] = await redis_connector.get('token')
    let vehicleInstance = axios.create({
      baseURL: 'http://localhost:3001/api/v1/vehicle',
      timeout: 1000,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const { data: response } = await vehicleInstance.delete(
      `/${policeNo}`
    );
    if(response){
      let [vehicles, err] = await redis_connector.get('vehicles')
      let arr_vehicle = JSON.parse(vehicles)
      let new_arr = arr_vehicle.filter((obj) => obj.policeNo !== policeNo);
      await redis_connector.set('vehicles', JSON.stringify(new_arr), 600000)
    }

    if (!response) {
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