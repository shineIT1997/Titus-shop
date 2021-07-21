const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { schema, options } = require('./schema')
const mongoosePaginate = require('@/libs/mongoose-paginate')

/**
  * Schemas
  */
const ProductSchema = new Schema(schema, options)

/**
  * Indexes
  */
// ProductSchema.index({ 'address.location': '2dsphere' })

/**
  * Plugins
  */
ProductSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('product', ProductSchema)
