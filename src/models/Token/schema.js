/**
*@file : schema.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 12:51:25 | Sunday, May 30, 2021
*@Editor : Visual Studio Code
*@summary : Token Schema
*/

// const { validateEmail } = require('@/utils/helper')
const { Schema } = require('mongoose')

const schema = {
  _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
}

const options = {
  collection: 'user',
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
}

module.exports = {
  schema,
  options
}
