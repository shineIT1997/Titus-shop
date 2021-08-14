/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 03:09:04 | Friday, August 13, 2021
*@Editor : Visual Studio Code
*@summary : api route manner
*/

const express = require('express')

const router = express.Router()

const {
  mannerListController
} = require('./controller')

router.get('/manner/list', mannerListController)

module.exports = router
