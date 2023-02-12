"use strict"
const router = require('express').Router()
const user = require('../controllers/user')
const passport = require('passport')
const { register, auth } = require('../middlewares/passport')

router.post('/signup', register)
router.post('/login', auth)

router.use(passport.authenticate('jwt', { session: true }))
router.get('/identityNumber/:identityNumber', user.getUserbyIdentityNumber)
router.get('/accountNumber/:accountNumber', user.getUserbyAccountNumber)
router.get('/', user.getUsers)
router.put('/:identityNumber', user.updateUser)
router.delete('/:identityNumber', user.deleteUser)

module.exports = router