var express = require('express');
var router = express.Router();

const Score = require('../models/score')

const Sequelize = require('sequelize')

const postScoreFunc = async(req, res, next) =>{
    const date = new Date()
    const scoreArray = JSON.parse(req.body.scoreArray)
    for (let employee of scoreArray) {
        // console.log(employee)
        await Score.create({...employee, date: date.toLocaleString()})
    }
    res.send('ok')
}

router.post('/add', postScoreFunc);
module.exports = router;
