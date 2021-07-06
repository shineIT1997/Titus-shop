/**
*@file : index.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 12:46:53 | Sunday, May 30, 2021
*@Editor : Visual Studio Code
*@summary : login token
*/

const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { schema, options } = require('./schema')

/**
  * Schemas
  */
const TokenSchema = new Schema(schema, options)

module.exports = mongoose.model('Token', TokenSchema)
