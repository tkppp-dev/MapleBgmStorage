const PlayListItem = require('../../models/playListItem')

module.exports = function(req, res, next){
    try{
        const ret = PlayListItem.destroy({
            where : {
                id : req.query.itemId,
                list_id : req.query.listId,
            }
        })

        if(ret){
            res.send({
                success : true,
                message : '곡이 재생목록에서 삭제되었습니다.'
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