'use strict';
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const Bgm = require('./bgm');
const FirstCategory = require('./firstCategory');
const SecondCategory = require('./secondCategory')
const ThirdCategory = require('./thirdCategory')
const User = require('./user')
const PlayList = require('./playList')
const PlayListItem = require('./playListItem')
const PlayListLike = require('./playListLike')

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Bgm = Bgm
db.FirstCategory = FirstCategory
db.SecondCategory = SecondCategory
db.ThirdCategory = ThirdCategory
db.User = User
db.PlayList = PlayList
db.PlayListLike = PlayListLike
db.PlayListItem = PlayListItem

for(let key in db){
    if(key != 'sequelize'){
        let model = db[key]
        model.init(sequelize)
    }
}

for(let key in db){
    if(key != 'sequelize'){
        let model = db[key]
        model.associate(db)
    }
}

module.exports = db;
