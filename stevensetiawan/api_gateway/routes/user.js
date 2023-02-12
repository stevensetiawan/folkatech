"use strict"
const router = require('express').Router()
const api = require('../controllers/api')

router.get('/identityNumber/:identityNumber', api.getUserbyIdentityNumber)
router.get('/accountNumber/:accountNumber', api.getUserbyAccountNumber)
router.get('/', api.getUsers)
router.put('/:identityNumber', api.updateUser)
router.delete('/:identityNumber', api.deleteUser)

module.exports = router
