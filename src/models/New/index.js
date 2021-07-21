const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { schema, options } = require('./schema')
const mongoosePaginate = require('@/libs/mongoose-paginate')
const mongooseSlug = require('@/libs/mongoose-slug')

/**
  * Schemas
  */
const NewSchema = new Schema(schema, options)

/**
  * Indexes
  */
// NewSchema.index({ 'address.location': '2dsphere' })

/**
  * Plugins
  */
NewSchema.plugin(mongooseSlug)
NewSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('new', NewSchema)
