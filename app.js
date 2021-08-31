const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const dotenv = require('dotenv')
const nunjucks = require('nunjucks')
const passport = require('passport')
const { sequelize } = require('./models/index')
const fs = require('fs')

const app = express()
dotenv.config()

// middleware setting
app.use(logger('dev'))
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended : false}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    secret : process.env.COOKIE_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : { path: '/', httpOnly: true, secure: false, maxAge: null }
}))

// template engine
app.set('view engine','html')
nunjucks.configure('views',{
    express : app,
    watch : true
})

// db connect
const Bgm = require('./models/bgm')
const makeTree = require('./modules/categoryTree')

sequelize.sync(({ force : false }))
    .then(async () => {
        try{
            result = await Bgm.findAll({raw : true})
            if(result.length === 0){
                const dataList = fs.readdirSync(__dirname + '/resources/bgm_json_data', 'utf8')
                for(let v of dataList){
                    let data = fs.readFileSync(__dirname + '/resources/bgm_json_data/' + v, 'utf8')
                    data = JSON.parse(data)
                    for(let key in data){
                        Bgm.create(data[key])
                    } 
                }
            }
            const bgmTree = await makeTree()
            bgmTree.addBgm(result)
            app.set('bgmTree', bgmTree)
        }catch(err){
            console.error(err)
        }
        console.log('Database Connect Success!')
    })
    .catch((err) => {
        console.error(err)
    })

// passport config
const passportConfig = require('./passport/index')
passportConfig()

app.use(passport.initialize())
app.use(passport.session())

// routing
const indexRouter = require('./route/routes')
app.use('/', indexRouter)

// error middleware
app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다`)
    err.status = 404
    next(err)
})

app.use((err, req, res, next) =>{
    res.status(err.status || 500)
    console.error(err) 
    
    if(err.status == 404){
        res.redirect('/error404')
    }
    else{
        res.redirect('/error')
    }
})

app.listen(8080, () => {
    console.log('Server On')
})