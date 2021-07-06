/**
 * File name: model.js
 * Created by Visual studio code
 * User: Danh Le / danh.le@dinovative.com
 * Date: 2019-01-18 17:38:19
 */

/**
 * Module dependencies.
 */
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { schema, options } = require('./schema')
const mongoosePaginate = require('@/libs/mongoose-paginate')

/**
  * Schemas
  */
const UserSchema = new Schema(schema, options)

/**
  * Indexes
  */
// UserSchema.index({ 'address.location': '2dsphere' })

/**
  * Plugins
  */
UserSchema.plugin(mongoosePaginate)

/**
  * methods
  */
UserSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.basicDetails = function () {
  const { id, firstName, lastName, username, role } = this
  return { id, firstName, lastName, username, role }
}

UserSchema.methods.delete = function() {
  this.status = 'archived'
  this.deletedAt = new Date()
  return this.save()
}

/**
  * hooks
  */
UserSchema.pre('save', function (next) {
  let user = this
  if (user.isModified('password')) {
    user.password = user.generateHash(user.password)
  }

  return next()
})

UserSchema.post('save', function(err, doc, next) {
  if (err && err.code === 11000) {
    let errorField = err.message.match(/index: ([a-zA-Z]*)_/)[1]
    return next(new Error(`This ${errorField} is already in used.`))
  }
  return next(err)
})

// /**
//   * Virtual type
//   */
// UserSchema.virtual('stores', {
//   ref: 'Store',
//   localField: '_id',
//   foreignField: 'owner'
// })

// UserSchema.virtual('store', {
//   ref: 'Store',
//   localField: '_id',
//   foreignField: 'owner',
//   justOne: true
// })

// UserSchema.virtual('reviews', {
//   ref: 'Review',
//   localField: '_id',
//   foreignField: 'deliver'
// })

// UserSchema.virtual('favorites', {
//   ref: 'Favorite',
//   localField: '_id',
//   foreignField: 'user'
// })

// UserSchema.virtual('vehicle', {
//   ref: 'Vehicle',
//   localField: '_id',
//   foreignField: 'driver',
//   justOne: true
// })

// UserSchema.virtual('vehicles', {
//   ref: 'Vehicle',
//   localField: '_id',
//   foreignField: 'driver'
// })

// UserSchema.virtual('orders', {
//   ref: 'ProductOrder',
//   localField: '_id',
//   foreignField: 'customer'
// })

// UserSchema.virtual('driverLicenses', {
//   ref: 'DriverLicense',
//   localField: '_id',
//   foreignField: 'driver'
// })

// UserSchema.virtual('driverStatus', {
//   ref: 'DriverStatus',
//   localField: '_id',
//   foreignField: 'driver',
//   justOne: true
// })

// UserSchema.virtual('promotions', {
//   ref: 'Promotion',
//   localField: '_id',
//   foreignField: 'users'
// })

module.exports = mongoose.model('User', UserSchema)
