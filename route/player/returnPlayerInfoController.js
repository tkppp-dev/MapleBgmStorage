const id3 = require('node-id3')
const Bgm = require('../../models/bgm')
const PlayList = require('../../models/playList')
const PlayListItem = require('../../models/playListItem')

module.exports = async (req, res, next) => {
    try {
        if (req.query.id !== undefined) {
            let result = await Bgm.findOne({
                where: [{
                    id: req.query.id
                }],
                raw: true
            })

            const {
                bgmNode,
                parentNode,
                splitIdx
            } = req.app.get('bgmTree').findBgmNode(result)
            const bgmSrc = bgmNode.getPath()

            // mp3 파일에서 메타데이터 읽어 이미지 추출후 base64 인코딩하여 본문에 삽입
            const data = id3.read(`./resources/bgm/${bgmSrc}.mp3`)
            const base64Image = `data:${data.image.mime};base64,${data.image.imageBuffer.toString('base64')}`

            if (req.query.type == 'onPlaylist') {
                res.send({
                    src: encodeURIComponent(bgmSrc + '.mp3'),
                    base64Image,
                })
            } else {
                let playlist
                if (req.query.type == 'standard') {
                    playlist = await getPlaylist(req, bgmNode, parentNode, splitIdx)
                } else if (req.query.type == 'playlist+id') {
                    playlist = await getPlaylist(req)
                }
                if (req.query.type == 'search') {
                    playlist = {
                        prev: [],
                        current: bgmNode,
                        next: []
                    }
                }

                res.send({
                    src: encodeURIComponent(bgmSrc + '.mp3'),
                    base64Image,
                    playlist,
                })
            }
        }
        else{
            const playlist = await getPlaylist(req)
            console.log(playlist.current)
            const { bgmNode } = req.app.get('bgmTree').findBgmNode(playlist.current)
            const bgmSrc = bgmNode.getPath()

            // mp3 파일에서 메타데이터 읽어 이미지 추출후 base64 인코딩하여 본문에 삽입
            const data = id3.read(`./resources/bgm/${bgmSrc}.mp3`)
            const base64Image = `data:${data.image.mime};base64,${data.image.imageBuffer.toString('base64')}`

            res.send({
                src: encodeURIComponent(bgmSrc + '.mp3'),
                base64Image,
                playlist,
            })
        }
    } catch (err) {
        console.error(err)
    }
}

async function getPlaylist(req, bgmNode, parentNode, splitIdx) {
    if (req.query.type == 'standard') {
        return {
            prev: parentNode.childBgm.slice(0, splitIdx),
            current: bgmNode,
            next: parentNode.childBgm.slice(splitIdx + 1)
        }

    } else if (req.query.type == 'playlist+id') {
        try {
            let ret = await PlayListItem.findAll({
                where: {
                    list_id: req.query.listId
                },
                attributes: ['id', 'list_order'],
                include: [{
                    model: Bgm,
                    attributes: ['id', 'name']
                }]
            })
            ret = ret.map(el => el.get({
                plain: true
            }))
            const prev = [],
                next = []
            let current, flag = 0
            for (let v of ret) {
                if (v.Bgm.id == req.query.id) {
                    current = v.Bgm
                    flag = 1
                } else {
                    if (flag == 0) {
                        prev.push(v.Bgm)
                    } else {
                        next.push(v.Bgm)
                    }
                }
            }
            return {
                prev,
                current,
                next
            }
        } catch (err) {
            console.error(err)
        }
    } else if (req.query.type == 'playlist') {
        try {
            const ret = await PlayList.findOne({
                include: [{
                    model: PlayListItem,
                    include: [{
                        model: Bgm,
                    }],
                }],
                where: {
                    id: req.query.listId
                },
                attributes: ['id', 'name', 'owner_id', 'like_cnt', 'createdAt'],
                order: [
                    ['id', 'ASC'],
                    [PlayListItem, 'list_order', 'ASC']
                ]
            })
            const rawRet = ret.PlayListItems.map(el => el.get({
                plain: true
            }))
            const playlist = {
                prev: [],
                current: null,
                next: []
            }
            for (let i=0; i < rawRet.length; i++) {
                if (i === 0) {
                    playlist.current = rawRet[i].Bgm
                } else {
                    playlist.next.push(rawRet[i].Bgm)
                }
            }
            return playlist
        } catch (err) {
            console.error(err)
        }
    }
}