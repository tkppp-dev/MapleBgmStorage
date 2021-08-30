const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

module.exports = function(){
    passport.use(new LocalStrategy({
        usernameField : 'userId',
        passwordField : 'password'
    }, async (userId, password , done) => {
        try{
            const user = await User.findOne({
                where : {
                    user_id : userId
                },
                raw : true
            })
            if(user){
                if(bcrypt.compareSync(password, user.password)){
                    done(null, user)
                }
                else{
                    done(null, false, { message : '비밀번호가 일치하지 않습니다'})
                }
            }
            else{
                done(null, false, { message : '아이디가 일치하지 않거나 가입되지 않은 회원입니다.'})
            }
        }catch(err){
            console.error(err)
            done(err)
        }
    }))
}