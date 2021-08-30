const { INTEGER } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = class PlayListLike extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            like_user_id: {
                type: INTEGER,
                allowNull: false
            },
            like_list_id: {
                type: INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'PlayListLike',
            tableName: 'play_list_like',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.PlayListLike.belongsTo(db.User, {
            foreignKey: 'like_user_id',
            sourceKey: 'id',
            onDelete: 'cascade'
        })
        db.PlayListLike.belongsTo(db.PlayList, {
            foreignKey: 'like_list_id',
            sourceKey: 'id',
            onDelete: 'cascade'
        })
    }
}