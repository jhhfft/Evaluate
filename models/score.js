const Sequelize = require('sequelize')
const path = require('path')

var sequelize = new Sequelize('score', undefined, undefined, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/database.sqlite')
})

// 测试数据库是否能连接成功
// sequelize.authenticate().then(()=>{
//     console.log('success')
// }).catch(error => {
//     console.log('error')
// })

const Score = sequelize.define('score', {
    // 姓名
    name: {
        type: Sequelize.STRING,
        // allowNull: false
    },
    department: {
        type: Sequelize.STRING,
    },
    one: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    two: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    three: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    four: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    five: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    judge:{
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.DATE,
    }
},
    {
        freezeTableName: true, // Model 对应的表名将与model名相同
        timestamps: false
    })

Score.sync()

module.exports = Score