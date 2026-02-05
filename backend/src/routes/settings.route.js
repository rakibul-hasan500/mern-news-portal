const express = require('express')
const { updateSettings, getSettingsData } = require('../controllers/settings.controller')
const verifyLogin = require('../middlewares/verify_login.middleware')
const router = express.Router()


// Update Settings
router.post('/update', verifyLogin, updateSettings)


// Get Settings Data
router.get('/', getSettingsData)








module.exports = router