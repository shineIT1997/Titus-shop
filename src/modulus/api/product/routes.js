/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 01:28:09 | Friday, August 13, 2021
*@Editor : Visual Studio Code
*@summary : product router api
*/

const express = require('express')

const router = express.Router()

const {
  productListController,
  productDetailController
} = require('./controller')

router.get('/product/list', productListController)
router.get('/product/:slug', productDetailController)

module.exports = router
