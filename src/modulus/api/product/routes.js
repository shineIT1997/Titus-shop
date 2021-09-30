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
  getAllProduct,
  productListController,
  productDetailController
} = require('./controller')

router.get('/allProducts', getAllProduct)
router.get('/search', productListController)
router.get('/product/:slug', productDetailController)

module.exports = router
