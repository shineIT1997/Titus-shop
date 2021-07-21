const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { schema, options } = require('./schema')
const mongoosePaginate = require('@/libs/mongoose-paginate')

/**
  * Schemas
  */
const Supplier = new Schema(schema, options)

/**
  * Indexes
  */
// CateSchema.index({ 'address.location': '2dsphere' })

/**
  * Plugins
  */
Supplier.plugin(mongoosePaginate)

module.exports = mongoose.model('supplier', Supplier)
