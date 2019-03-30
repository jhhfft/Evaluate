var express = require('express');
var Excel = require('exceljs');
var path = require("path")
var router = express.Router();

const Score = require('../models/score')

const Sequelize = require('sequelize')

const postScoreFunc = async(req, res, next) =>{
    const date = new Date()
    const scoreArray = JSON.parse(req.body.scoreArray)
    try {
        for (let employee of scoreArray) {
            // console.log(employee)
            await Score.create({...employee, date: date.toLocaleString()})
        }
    }catch(err){
        res.send({state: '0', info: '网络故障请稍后再试'})
    }
    res.send({state: '1', info: '保存成功'})
}

const getResultFunc = async(req, res, next) =>{
    // 设置查询的起始时间
    let date = req.query.date
    let startDate = new Date(date)
    startDate.setHours(0)
    let endDate = new Date(date)
    endDate.setMonth(endDate.getMonth()+1)
    endDate.setHours(0)
    // 在表中查找
    const opts = {where: {}}
    opts.where.date = {
        [Sequelize.Op.gte]: startDate,
        [Sequelize.Op.lte]: endDate
    }
    const queryResult = await Score.findAndCountAll(opts)
    const count = queryResult.count
    if(count == 0){
        res.send({state: 0})
    }
    // console.log(queryResult.rows)
    const title = ['name', 'department', 'one', 'two', 'three', 'four','five','date']
    const finalResult = []
    queryResult.rows.forEach((item, index)=>{
        finalResult[index] = []
        title.forEach(t=>{
            finalResult[index].push(item.get(t))
        })
    })
    // 将结果写入Excel表中
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('date')
    worksheet.addRow(["姓名", "部门", "服务一线，服务前端，态度和蔼，言行举止文明礼貌","听取一线意见，处理一线提出的问题，为基层排忧解难","落实首问负责制，兑现工作承诺，不推诿扯皮或拖拉","围绕公司重点部署推动工作，开展交流培训，调查研究，检查指导","合理安排全市资源，沟通分享先进经验及成功案例，总结推广","统计时间"])
    for (let row of finalResult){
        worksheet.addRow(row)
    }
    const filePath = './public/score-file/'+date+'.xlsx' 
    workbook.xlsx.writeFile(filePath).then(function(){
        res.send({state: 1, url: 'http://127.0.0.1:3000/score-file/'+date+'.xlsx'})
    })
    
}
router.post('/add', postScoreFunc);
router.get('/getResult', getResultFunc);
module.exports = router;
