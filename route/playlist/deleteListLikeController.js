const PlayList = require('../../models/playList')
const PlayListLike = require('../../models/playListLike')

module.exports = async function(req, res, next){
    try{
        await PlayListLike.destroy({
            where : {
                like_user_id : req.user.id,
                like_list_id : req.query.listId
            }
        })

        const ret = await PlayList.findOne({
            where : {
                id : req.query.listId
            }
        })

        await PlayList.update({
            like_cnt : ret.dataValues.like_cnt - 1
        },{
            where : {
                id : req.query.listId
            }
        })

        res.send({
            success : true
        })
    }catch(err){
        console.error(err)
    }
}