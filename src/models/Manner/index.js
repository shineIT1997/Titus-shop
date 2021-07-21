const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { schema, options } = require('./schema')
const mongoosePaginate = require('@/libs/mongoose-paginate')

/**
  * Schemas
  */
const MannerSchema = new Schema(schema, options)

/**
  * Indexes
  */
// MannerSchema.index({ 'address.location': '2dsphere' })

/**
  * Plugins
  */
MannerSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('manner', MannerSchema)
