const PlayListItem = require('../../models/playListItem')

module.exports = async function(req, res){
    const listItem = {
        bgm_id : req.body.bgmId,
        list_id : req.body.listId,
    }   
    try{
        const duplicateCheck = await PlayListItem.findOne({
            where : listItem
        })
        if(duplicateCheck){
            return res.status(201).send({
                success : false,
                message : '해당 재생목록에 이미 추가된 곡입니다.'
            })
        }

        const order = await PlayListItem.findAndCountAll({
            where : {
                list_id : listItem.list_id
            }
        })
        listItem.list_order = order.count
        if(order){
            await PlayListItem.create(listItem)
            return res.send({
                success : true,
                message : '재생목록에 추가되었습니다.'
            })
        }
    }catch(err){
       console.error(err)
    }
}