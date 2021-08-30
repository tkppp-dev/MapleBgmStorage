const { INTEGER, STRING } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = class Bgm extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name : {
                type : STRING(200),
                allowNull : false
            },
            category1 : {
                type : STRING(50),
                allowNull : false
            },
            category2 : {
                type : STRING(50),
                allowNull : true,
                default : null
            },
            category3 : {
                type : STRING(50),
                allowNull : true,
                default : null
            },
            depth : {
                type : INTEGER,
                allowNull : false
            },
            type : {
                type : STRING(10),
                allowNull : false
            }
        },{
            sequelize,
            timestamps : false,
            modelName : 'Bgm',
            tableName : 'bgms',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }
    
    static associate(db){
        db.Bgm.hasMany(db.PlayListItem, {
            foreignKey : 'bgm_id',
            sourceKey : 'id',
            onDelete : 'cascade',
        })
    }
}