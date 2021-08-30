const PlayList = require('../../models/playList')
const PlayListItem = require('../../models/playListItem')
const Bgm = require('../../models/bgm')

module.exports = async function(req, res, next){
    try{
        if(req.query.listType == 'popular'){
            var list = await PlayList.findAll({
                include : [{
                    model : PlayListItem,
                    include : [{
                        model : Bgm,
                        attributes : ['id', 'name', 'category1', 'category2', 'category3']
                    }],
                }],
                attributes : ['id', 'name', 'owner_id', 'like_cnt'],
                order : [['like_cnt', 'DESC']],
                limit : 10,
                offset : req.query.offset * 10
            })
        }
        else if(req.query.listType == 'recent'){
            var list = await PlayList.findAll({
                include : [{
                    model : PlayListItem,
                    include : [{
                        model : Bgm,
                        attributes : ['id', 'name', 'category1', 'category2', 'category3']
                    }],
                }],
                order : [['createdAt', 'DESC']],
                limit : 10,
                offset : req.query.offset * 10
            })
        }
        list = list.map(el => el.get({plain : true}))
        
        if(list.length > 0){
            res.send({
                success : true,
                list
            })
        }
        else{
            return res.send({
                success : false,
                message : '더이상 불러올 대상이 없습니다.'
            })
        }
    }catch(err){
        console.error(err)
    }

}