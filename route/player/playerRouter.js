const express = require('express')
const router = express.Router()
const returnPlayerInfoController = require('./returnPlayerInfoController')

router.get('/', returnPlayerInfoController)

module.exports = router