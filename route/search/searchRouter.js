const express = require('express')
const router = express.Router()

const returnSearchResult = require('./returnSearchResult')

router.get('/', returnSearchResult)

module.exports = router