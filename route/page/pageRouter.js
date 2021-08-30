const express = require('express')
const { isLogin, isNotLogin } = require('../middlewares/authMiddleware')
const Bgm = require('../../models/bgm')
const PlayListItem = require('../../models/playListItem')
const PlayList = require('../../models/playList')

const router = express.Router()

router.use((req, res, next) => {
    res.locals.user = req.user
    next()
})

router.get('/', (req, res, next) => {
    res.render('index', {
        data : req.app.get('bgmTree').root.child,
        title : 'Maple BGM Storage - Main'
    })
})

router.get('/loginPage', isNotLogin, (req, res) => {
    res.render('login', {
        title : 'Maple BGM Storage - Login'
    })
})

router.get('/joinPage', isNotLogin,(req, res) => {
    res.render('join', {
        title : 'Maple BGM Storage - Join'
    })
})

router.get('/myPage', isLogin, (req, res) => {
    res.render('mypage', {
        title : 'Maple BGM Storage - MyPage'
    })
})

router.get('/playlistPage', async (req, res) => {
    const userId = req.user ? req.user.id : 0
    let myPlaylist = await PlayList.findAll({
        include : [{
            model : PlayListItem,
            include : [{
                model : Bgm,
                attributes : ['id', 'name', 'category1', 'category2', 'category3']
            }],
        }],
        where : {
            owner_id : userId
        },
        attributes : ['id', 'name', 'owner_id'],
        order : [['id', 'ASC'], [PlayListItem, 'list_order', 'ASC']]
    })
    
    let popularPlaylist = await PlayList.findAll({
        include : [{
            model : PlayListItem,
            include : [{
                model : Bgm,
                attributes : ['id', 'name', 'category1', 'category2', 'category3']
            }],
        }],
        attributes : ['id', 'name', 'owner_id', 'like_cnt'],
        order : [['like_cnt', 'DESC']],
        limit : 10
    })

    let recentPlaylist = await PlayList.findAll({
        include : [{
            model : PlayListItem,
            include : [{
                model : Bgm,
                attributes : ['id', 'name', 'category1', 'category2', 'category3']
            }],
        }],
        order : [['createdAt', 'DESC']],
        limit : 10
    })

    myPlaylist = myPlaylist.map(el => el.get({plain : true}))
    popularPlaylist = popularPlaylist.map(el => el.get({plain : true}))
    recentPlaylist = recentPlaylist.map(el => el.get({plain : true}))
    res.render('playlist',{
        title : 'Maple BGM Storage - PlayList',
        myPlaylist,
        popularPlaylist,
        recentPlaylist
    })
})

router.get('/searchPage', async (req, res) => {
    res.render('search', {
        title : 'Maple BGM Storage - Search'
    })
}) 

router.get('/error', (req, res) => {
    res.render('error', {
        title : 'Maple BGM Storage - Error'
    })
})

router.get('/error404', (req, res) => {
    res.render('error404', {
        title : 'Maple BGM Storage - Error'
    })
})

module.exports = router