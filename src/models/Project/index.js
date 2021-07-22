const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { schema, options } = require('./schema')
const mongoosePaginate = require('@/libs/mongoose-paginate')
const mongooseSlug = require('@/libs/mongoose-slug')

/**
  * Schemas
  */
const ProjecSchema = new Schema(schema, options)

/**
  * Indexes
  */
// ProjecSchema.index({ 'address.location': '2dsphere' })

/**
  * Plugins
  */
ProjecSchema.plugin(mongooseSlug)
ProjecSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('project', ProjecSchema)
