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
<<<<<<< HEAD:src/modulus/api/home/routes.js
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
=======
  homeController
} = require('./controller')

router.get('/home', homeController)
>>>>>>> e9f0f6c152033350382d351a597ddcb5d34fff9b:src/modulus/api/auth/routes.js

module.exports = router
