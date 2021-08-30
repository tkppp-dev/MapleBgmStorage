const passport = require('passport')

module.exports = async function(req, res, next){
    // 1. 로그인 요청시 로그인 수행 : passport.authenticate(strategy, callback)
    // strategy 인자에 따라 해당하는 로그인 전략 수행
    // 로그인 전략에서 done() 메소드로 받은 인자가 두번쨰 콜백의 인자로 들어와 콜백 수행
    passport.authenticate('local', (authError, user ,info) => {
        if(authError){
            console.error(authError)
            return next(authError)
        }
        if(!user){
            return res.status(201).send({
                success : false,
                message : info.message
            })
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError)
                return next(loginError)
            }
            return res.status(201).send({
                success : true,
            })
        })
    })(req, res, next)
}