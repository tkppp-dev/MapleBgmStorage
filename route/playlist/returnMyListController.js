const PlayList = require('../../models/playList')
const PlayListItem = require('../../models/playListItem')
const Bgm = require('../../models/bgm')

module.exports = async function(req, res, next){
    try{
        if(!(req.user)){
            const err = new Error('비정상적인 접근 - 로그인 필요')
            err.status = 403
            next(err)
        }
        let listBgmArr = await PlayListItem.findAll({
            where : {
                list_id : req.query.listId
            },
            include : {
                model : Bgm,
                attributes : ['id', 'name', 'category1', 'category2', 'category3']
            },
            attributes : ['id','list_id']
        })

        listBgmArr = listBgmArr.map(el => el.get({plain : true}))
        res.send({
            success: true,
            listBgmArr,
        })
    }catch(err){
        console.error(err)
    }
}