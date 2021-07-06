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
  testController
} = require('./controller')

/* POST register a acount. */
router.post('/auth/register', registerController)

/**
 * login
 */
router.post('/auth/login', loginController)

/**
 * test Api
 */

router.post('/auth/test', testController)

module.exports = router
