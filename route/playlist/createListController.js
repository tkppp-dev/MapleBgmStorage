const PlayList = require('../../models/playList')

module.exports = async function(req, res){
    const list = {
        name : req.body.name,
        owner_id : req.user.id
    }   
    try{
        const ret = await PlayList.create(list)
        console.log(ret)
        if(ret){
            res.send({
                success : true,
                message : '재생목록이 만들어졌습니다.'
            })
        }
    }catch(err){
       console.error(err)
    }
}