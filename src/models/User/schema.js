
/**
*@file : schema.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 00:00:33 | Saturday, April 03, 2021
*@Editor : Visual Studio Code
*@summary : users's schema
*/

const { validateEmail } = require('@/utils/helper')

const schema = {
  email: {
    type: String,
    trim: true,
    require: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: props => `${props.value} is not a valid email!`
    }
  },
  phone: {
    type: String,
    trim: true,
    sparse: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}

const options = {
  collection: 'User',
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
}

module.exports = {
  schema,
  options
}
