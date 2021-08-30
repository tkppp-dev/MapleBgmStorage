const { INTEGER, STRING } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = class ThirdCategory extends Sequelize.Model{
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
            modelName : 'ThirdCategory',
            tableName : 'third_category',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }

    static associate(db){
        db.ThirdCategory.belongsTo(db.SecondCategory, { foreignKey : 'parent_id', sourceKey : 'id' })
    }
}