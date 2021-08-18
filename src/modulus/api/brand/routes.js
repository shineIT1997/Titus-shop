/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 03:09:04 | Friday, August 13, 2021
*@Editor : Visual Studio Code
*@summary : api route brand
*/

const express = require('express')

const router = express.Router()

const {
  brandListController
} = require('./controller')

router.get('/brand/list', brandListController)

module.exports = router
