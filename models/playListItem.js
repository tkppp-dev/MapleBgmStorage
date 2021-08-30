const { INTEGER } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = class PlayListItem extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            bgm_id : {
                type : INTEGER,
                allowNull : false
            },
            list_id : {
                type : INTEGER,
                allowNull : false
            },
            list_order : {
                type : INTEGER,
                allowNull : false
            } 
        }, {
            sequelize,
            timestamps: false,
            modelName: 'PlayListItem',
            tableName: 'play_list_item',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db){
        db.PlayListItem.belongsTo(db.Bgm, {
            foreignKey : 'bgm_id',
            sourceKey : 'id',
            onDelete : 'cascade',
        })
        db.PlayListItem.belongsTo(db.PlayList, {
            foreignKey : 'list_id',
            sourceKey : 'id',
            onDelete : 'cascade'
        })
    }
}