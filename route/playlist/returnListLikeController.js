const PlayList = require('../../models/playList')
const PlayListLike = require('../../models/playListLike')

module.exports = async function(req, res, next){
    if(!req.user){
        return res.send({
            isLogin : false
        })
    }
    try{
        if(req.query.type == 'popular'){
            var list = await PlayList.findAll({
                attributes : ['id', 'like_cnt'],
                order : [['like_cnt', 'DESC']],
                limit : 10,
                offset : req.query.offset * 10,
                raw : true
            })
        }
        else if(req.query.type == 'recent'){
            var list = await PlayList.findAll({
                attributes : ['id', 'createdAt'],
                order : [['createdAt', 'DESC']],
                limit : 10,
                offset : req.query.offset * 10,
                raw : true
            })
        }
        const likeList = []
        for(let el of list){
            const ret = await PlayListLike.findOne({
                where : {
                    like_user_id : req.user.id,
                    like_list_id : el.id
                },
                raw : true
            })
            if(ret){
                likeList.push({
                    listId : el.id,
                    isLike : true
                })
            }
            else{
                likeList.push({
                    listId : el.id,
                    isLike : false
                })
            }
        }
        
        res.send({
            isLogin : true,
            likeList
        })
        
    }catch(err){
        console.error(err)
    }
}