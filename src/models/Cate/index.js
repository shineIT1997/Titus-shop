const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { schema, options } = require('./schema')
const mongoosePaginate = require('@/libs/mongoose-paginate')

/**
  * Schemas
  */
const CateSchema = new Schema(schema, options)

/**
  * Indexes
  */
// CateSchema.index({ 'address.location': '2dsphere' })

/**
  * Plugins
  */
CateSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('cate', CateSchema)
