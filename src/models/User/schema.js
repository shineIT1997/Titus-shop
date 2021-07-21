
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
  firstname: {
    type: String,
    trim: true,
    require: true
  },
  lastname: {
    type: String,
    trim: true,
    require: true
  },
  address: {
    type: String,
    trim: true,
    require: true
  },
  city: {
    type: String,
    trim: true,
    require: true
  },
  roles: {
    type: String,
    trim: true,
    require: true
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
    type: String,
    require: true
  }

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
