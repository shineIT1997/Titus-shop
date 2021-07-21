let mongoose = require('mongoose')
let Schema = mongoose.Schema

let schema = new Schema({
  cateId: {
    type: String,
    trim: true,
    require: true,
    unique: true
  },
  name: {
    type: String,
    trim: true,
    require: true
  },
  imagePath: {
    type: String,
    trim: true,
    require: true
  }
})

const options = {
  collection: 'cate',
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
}

module.exports = {
  schema,
  options
}
