const PlayList = require('../../models/playList')
module.exports = function(req, res, next){
    try{
        const ret = PlayList.destroy({
            where : {
                id : req.query.id,
                owner_id : req.user.id
            }
        })

        if(ret){
            res.send({
                success : true,
                message : '재생목록이 삭제되었습니다.'
            })
        }
        else{
            res.send({
                success : false,
                message : '권한이 없습니다.'
            })
        }
    }catch(err){
        console.error(err)
    }
}