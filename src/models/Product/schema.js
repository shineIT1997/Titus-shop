let mongoose = require('mongoose')
let Schema = mongoose.Schema

let schema = new Schema({
  title: {
    type: String,
    trim: true,
    require: true,
    unique: true
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
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    trim: true,
    require: true
  },
  quantity: {
    type: Number,
    trim: true,
    require: true
  },
  style: [{
    type: Schema.Types.ObjectId,
    ref: 'style'
  }],
  type: [{
    type: Schema.Types.ObjectId,
    ref: 'cate'
  }]
})

const options = {
  collection: 'product',
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
}

module.exports = {
  schema,
  options
}
