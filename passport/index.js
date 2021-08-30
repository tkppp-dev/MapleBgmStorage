const passport = require('passport')
const local = require('./localStrategy')
const User = require('../models/user')

module.exports = function(){
    /**
     * serializeUser : 로그인 시 실행되며 세션에 어떤 데이터를 넣을지 지정
     * 콜백의 인자인 done 함수의 두번째 인자가 세션에 넣을 데이터
     */
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    /**
     * deserializeUser : 매 요청시 실행되며 passport.session() 메서드가 실행하는 함수
     * 세션에 저장한 데이터로 데이터베이스를 조회하며 조회한 데이터를 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있다.
     */
    passport.deserializeUser(async (id, done) => {
        try{
            const user = await User.findOne({
                where : {id},
                raw : true
            })

            done(null, user)
        }catch(err){
            done(err)
        }
    })
    
    local()
}