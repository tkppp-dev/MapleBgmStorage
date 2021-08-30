const { STRING } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = class FirstCategory extends Sequelize.Model{
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
            }
        }, {
            sequelize,
            timestamps : false,
            modelName : 'FirstCategory',
            tableName : 'first_category',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }

    static associate(db){
        db.FirstCategory.hasMany(db.SecondCategory, { foreignKey : 'parent_id', sourceKey : 'id'})
    }
}