var express = require('express');
var Excel = require('exceljs');
var path = require("path")
var router = express.Router();

const Score = require('../models/score')

const Sequelize = require('sequelize')

const postScoreFunc = async(req, res, next) =>{
    const date = new Date()
    // date.setHours(0)
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
    const title01 = ['name', 'department', 'one']
    const title02 = ['name', 'department', 'two']
    const title03 = ['name', 'department', 'three']
    const title04 = ['name', 'department', 'four']
    const title05 = ['name', 'department', 'five']
    const title06 = ['name', 'department', 'judge']
    const quota01 = []
    const quota02 = []
    const quota03 = []
    const quota04 = []
    const quota05 = []    
    const quota06 = []
    queryResult.rows.forEach((item, index)=>{
        quota01[index] = []
        quota02[index] = []
        quota03[index] = []
        quota04[index] = []
        quota05[index] = []
        quota06[index] = []
        title01.forEach(t=>{
            quota01[index].push(item.get(t))
        })
        title02.forEach(t=>{
            quota02[index].push(item.get(t))
        })
        title03.forEach(t=>{
            quota03[index].push(item.get(t))
        })
        title04.forEach(t=>{
            quota04[index].push(item.get(t))
        })
        title05.forEach(t=>{
            quota05[index].push(item.get(t))
        })
        title06.forEach(t=>{
            quota06[index].push(item.get(t))
        })
    })
    // 将结果写入Excel表中
    const workbook = new Excel.Workbook();
    const worksheet01 = workbook.addWorksheet("指标一")
    const worksheet02 = workbook.addWorksheet("指标二")
    const worksheet03 = workbook.addWorksheet("指标三")
    const worksheet04 = workbook.addWorksheet("指标四")
    const worksheet05 = workbook.addWorksheet("指标五")
    const worksheet06 = workbook.addWorksheet("评价")
    worksheet01.addRow(["姓名", "部门", "服务一线，服务前端，态度和蔼，言行举止文明礼貌"])
    worksheet02.addRow(["姓名", "部门", "听取一线意见，处理一线提出的问题，为基层排忧解难"])
    worksheet03.addRow(["姓名", "部门", "落实首问负责制，兑现工作承诺，不推诿扯皮或拖拉"])
    worksheet04.addRow(["姓名", "部门", "围绕公司重点部署推动工作，开展交流培训，调查研究，检查指导"])
    worksheet05.addRow(["姓名", "部门", "合理安排全市资源，沟通分享先进经验及成功案例，总结推广"])
    worksheet06.addRow(["姓名", "部门", "评价"])
    for (let row of quota01){
        worksheet01.addRow(row)
    }
    for (let row of quota02){
        worksheet02.addRow(row)
    }
    for (let row of quota03){
        worksheet03.addRow(row)
    }
    for (let row of quota04){
        worksheet04.addRow(row)
    }
    for (let row of quota05){
        worksheet05.addRow(row)
    }
    for (let row of quota06){
        worksheet06.addRow(row)
    }
    const filePath = './public/score-file/'+date+'.xlsx' 
    workbook.xlsx.writeFile(filePath).then(function(){
        res.send({state: 1, url: 'http://127.0.0.1:3000/score-file/'+date+'.xlsx'})
    })
    
}
router.post('/add', postScoreFunc);
router.get('/getResult', getResultFunc);
module.exports = router;
