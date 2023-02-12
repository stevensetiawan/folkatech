"use strict"
const router = require('express').Router()
const api = require('../controllers/api')

router.get('/', api.getVehicles)
router.get('/:policeNo', api.getVehicleByPoliceNo)
router.post('/', api.createVehicle)
router.put('/:policeNo', api.updateVehicle)
router.delete('/:policeNo', api.deleteVehicle)

module.exports = router
