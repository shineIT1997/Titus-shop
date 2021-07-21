/**
*@file : clientErrorHandler.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 15:05:29 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary :  Define error-handling middleware functions
*/

const createError = require('http-errors')

const clientErrorHandler = (req, res, next) => {
  // next(createError(404))
}

module.exports = clientErrorHandler
