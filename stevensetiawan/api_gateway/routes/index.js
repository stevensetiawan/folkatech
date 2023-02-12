"use strict"
const router = require('express').Router()
const passport = require('passport')
const { register, auth } = require('../middlewares/passport')
const user = require('./user')
const vehicle = require('./vehicle')


router.post('/signup', register)
router.post('/login', auth)

router.use(passport.authenticate('jwt', { session: true }))
router.use('/user', user)
router.use('/vehicle', vehicle)

module.exports = router
