const User = require('../../models/user')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = async function(req, res, next){
    const { userId, password, nickName } = req.body

    try{
        const user = await User.findOne({
            raw : true,
            where : {
                user_id : userId
            }
        })
        if(user){
            return res.status(201).send({
                success : false,
                message : '사용할수 없는 아이디입니다.'
            })
        }
        const nick = await User.findOne({
            raw : true,
            where : {
                nick_name : nickName
            }
        })
        if(nick){
            return res.status(201).send({
                success : false,
                message : '사용할수 없는 별명입니다.'
            })
        }
        
        await User.create({
            user_id : userId,
            password : bcrypt.hashSync(password, 10),
            nick_name : nickName
        })
        return res.status(201).send({
            success : true,
            message : '회원가입이 완료되었습니다.'
        })
    }catch(err){
        console.error(err)
    }
}