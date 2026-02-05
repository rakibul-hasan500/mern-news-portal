const express = require('express')
const verifyLogin = require('../middlewares/verify_login.middleware')
const { getStates } = require('../controllers/dashboard.controller')
const router = express.Router()


// Get States
router.get('/stats', verifyLogin, getStates)










module.exports = router