const express = require('express')
const loginController = require('./loginController')
const logoutController = require('./logoutController')
const joinController = require('./joinController')
const { isLogin, isNotLogin } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/join', isNotLogin, joinController)
router.post('/login', isNotLogin,loginController)
router.post('/logout', isLogin, logoutController)

module.exports = router