/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 17:58:20 | Friday, May 21, 2021
*@Editor : Visual Studio Code
*@summary : api route
*/

const express = require('express')

const router = express.Router()

const { homeController } = require('./controller')

router.get('/home', homeController)

module.exports = router
