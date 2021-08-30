const express = require('express')
const fs = require('fs')

const router = express.Router()
const pageRouter = require('./page/pageRouter')
const playerRouter = require('./player/playerRouter')
const authRouter = require('./auth/authRouter')
const playListRouter = require('./playlist/playlistRouter')
const searchRouter = require('./search/searchRouter')

router.use('/', pageRouter)
router.use('/player', playerRouter)
router.use('/auth', authRouter)
router.use('/playlist', playListRouter)
router.use('/search', searchRouter)
router.get('/resources/bgm/:path', (req, res, next) => {
    const path = decodeURIComponent(req.params.path)
    let stream = fs.createReadStream('./resources/bgm/' + path).pipe(res)
})

module.exports = router