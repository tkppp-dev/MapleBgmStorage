const PlayList = require('../../models/playList')

module.exports = async function(req, res){
    try{
        if(!(req.user)){
            return res.send({
                success : false,
                message : '로그인이 필요한 서비스입니다.'
            })
        }
        const listArr = await PlayList.findAll({
            where : {
                owner_id : req.user.id
            },
            attributes : ['id', 'name'],
            raw : true
        })
        res.send({
            success: true,
            listArr,
        })
    }catch(err){
        console.error(err)
    }
}