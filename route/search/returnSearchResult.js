const Bgm = require('../../models/bgm')
const PlayList = require('../../models/playList')
const PlayListItem = require('../../models/playListItem')
const PlayListLike = require('../../models/playListLike')

const { Op } = require('sequelize')

module.exports = async function(req, res, next){
    const input = '%' + decodeURIComponent(req.query.input) + '%'
    try{
        const bgmResult = await Bgm.findAll({
            where : {
                [Op.or] : [
                    { 
                        name : {
                            [Op.like] : input
                        }
                    },
                    {
                        category1 : {
                            [Op.like] : input
                        }
                    },
                    {
                        category2 : {
                            [Op.like] : input
                        }
                    },
                    {
                        category3 : {
                            [Op.like] : input
                        }
                    },
                ]
            },
            raw : true
        })

        let playlistResult = await PlayList.findAll({
            include : [{
                model : PlayListItem,
                include : [{
                    model : Bgm,
                    attributes : ['id', 'name', 'category1', 'category2', 'category3']
                }],
            }],
            where : {
                name : {
                    [Op.like] : input
                }
            },
            attributes : ['id', 'name', 'owner_id', 'like_cnt'],
        })

        playlistResult = playlistResult.map(el => el.get({plain : true}))
        
        let listLikeArr = []
        if(req.user && req.user.id){
            for(let item of playlistResult){
                const ret = await PlayListLike.findOne({
                    where : {
                        like_user_id : req.user.id,
                        like_list_id : item.id
                    }
                })
                if(ret){
                    listLikeArr.push({
                        isLike : true
                    })
                }
                else{
                    listLikeArr.push({
                        isLike : false
                    })
                }
            }
        }

        res.send({
            bgmResult,
            playlistResult,
            listLikeArr
        })
    }
    catch(err){
        console.error(err)
    }
}