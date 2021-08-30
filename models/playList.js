const { INTEGER, STRING } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = class PlayList extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: STRING(50),
                allowNull: false,
            },
            owner_id: {
                type: INTEGER,
                allowNull: false
            },
            like_cnt : {
                type : INTEGER,
                allowNull : false,
                defaultValue : 0
            }
        }, {
            sequelize,
            timestamps: true,
            modelName: 'PlayList',
            tableName: 'play_list',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.PlayList.belongsTo(db.User, {
            foreignKey: 'owner_id',
            sourceKey: 'id',
            onDelete: 'cascade'
        })
        db.PlayList.hasMany(db.PlayListItem, {
            foreignKey : 'list_id',
            sourceKey : 'id',
            onDelete : 'cascade'
        })
        db.PlayList.hasMany(db.PlayListLike, {
            foreignKey: 'like_list_id',
            sourceKey: 'id',
            onDelete: 'cascade'
        })
    }
}