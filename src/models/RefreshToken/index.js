/**
*@file : index.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 21:49:41 | Sunday, June 13, 2021
*@Editor : Visual Studio Code
*@summary : Refresh Token
*/

const schema = require('./schema')
const mongoose = require('mongoose')

module.exports = mongoose.model('refreshToken', schema)
