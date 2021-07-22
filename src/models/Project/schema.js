let mongoose = require('mongoose')
let Schema = mongoose.Schema

let schema = new Schema({
  title: {
    type: String,
    trim: true,
    require: true
  },
  slug: {
    type: String,
    trim: true,
    require: true,
    unique: true
  },
  imagePath: {
    type: String,
    trim: true,
    require: true
  },
  body: {
    type: String,
    trim: true,
    require: true
  },
  metaTitle: {
    type: String,
    trim: true,
    require: true
  },
  metaKeywords: {
    type: String,
    trim: true,
    require: true
  },
  metaDescription: {
    type: String,
    trim: true,
    require: true
  }
})

const options = {
  collection: 'project',
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
}

module.exports = {
  schema,
  options
}
