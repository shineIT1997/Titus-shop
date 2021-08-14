/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 17:58:20 | Friday, May 21, 2021
*@Editor : Visual Studio Code
*@summary : api route
*/

const express = require('express')

const router = express.Router()

const {
  loginController,
  registerController,
  homeController
} = require('./controller')

/* POST register a acount. */
router.post('/home', homeController)

/**
 * login
 */
router.post('/auth/login', loginController)

module.exports = router
