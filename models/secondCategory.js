const { INTEGER, STRING } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = class SecondCategory extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name : {
                type : STRING(50),
                allowNull : false,
                unique : true
            },
            engName : {
                type : STRING(50),
                allowNull : false,
                unique : true
            },
            parent_id : {
                type : INTEGER,
                allowNull : false,
            }
        }, {
            sequelize,
            timestamps : false,
            modelName : 'SecondCategory',
            tableName : 'second_category',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }

    static associate(db){
        db.SecondCategory.belongsTo(db.FirstCategory, { foreignKey : 'parent_id', sourceKey : 'id' })
        db.SecondCategory.hasMany(db.ThirdCategory, { foreignKey : 'parent_id', sourceKey : 'id' })
    }
}