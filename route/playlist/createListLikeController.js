const PlayList = require('../../models/playList')
const PlayListLike = require('../../models/playListLike')

module.exports = async function(req, res, next){
    if(!req.user){
        return res.send({
            isLogin : false
        })
    }
    try{
        const ret = await PlayList.findOne({
            where : {
                id : req.body.listId
            },
            attributes : ['like_cnt', 'owner_id']
        })
        
        if(ret.dataValues.owner_id == req.user.id){
            return res.send({
                isLogin : true,
                success : false,
                message : '자신이 만든 재생목록은 좋아요를 누를수 없습니다'
            })
        }

        await PlayListLike.create({
            like_user_id : req.user.id,
            like_list_id : req.body.listId
        })
        await PlayList.update({
            like_cnt : ret.dataValues.like_cnt + 1,
        }, { 
            where : {
                id : req.body.listId
            }
        })
        return res.send({
            isLogin : true,
            success : true
        })
    }catch(err){
        console.error(err)
    }
}   