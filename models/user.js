const { STRING } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id: {
                type: STRING(50),
                allowNull: false,
                unique: true
            },
            password: {
                type: STRING(75),
                allowNull: false
            },
            nick_name: {
                type: STRING(50),
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'User',
            tableName: 'user',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.User.hasMany(db.PlayList, {
            foreignKey: 'owner_id',
            sourceKey: 'id',
            onDelete: 'cascade'
        })
        db.User.hasMany(db.PlayListLike, {
            foreignKey: 'like_user_id',
            sourceKey: 'id',
            onDelete: 'cascade'
        })
    }
}