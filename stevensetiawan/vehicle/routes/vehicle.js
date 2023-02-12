"use strict"
const router = require('express').Router()
const vehicle = require('../controllers/vehicle')
const passport = require('passport')
const { register, auth } = require('../middlewares/passport')

router.use(passport.authenticate('jwt', { session: true }))
router.get('/:policeNo', vehicle.getVehicleByPoliceNo)
router.get('/', vehicle.getVehicles)
router.post('/', vehicle.createVehicle)
router.put('/:policeNo', vehicle.updateVehicle)
router.delete('/:policeNo', vehicle.deleteVehicle)

module.exports = router