exports.isLogin = function(req, res, next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        const err = new Error(`로그인이 필요합니다`)
        err.status = 403
        next(err)
    }
}

exports.isNotLogin = function(req, res, next){
    if(!req.isAuthenticated()){
        next()
    }else{ 
        const err = new Error(`이미 로그인한 상태입니다.`)
        err.status = 403
        next(err)
    }
}