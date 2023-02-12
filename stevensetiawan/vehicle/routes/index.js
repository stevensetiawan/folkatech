"use strict"
const router = require('express').Router()
const vehicle = require('./vehicle')

router.use('/vehicle', vehicle)

module.exports = router
