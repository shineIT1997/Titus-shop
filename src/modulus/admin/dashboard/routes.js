/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 15:24:06 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary : create route for dashboard page
*/
const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
