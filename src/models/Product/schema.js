let mongoose = require('mongoose')
let Schema = mongoose.Schema

let schema = new Schema({
  productId: {
    type: String,
    trim: true,
    require: true,
    unique: true
  },
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
    type: Array,
    trim: true,
    require: true
  },
  description: {
    type: String,
    trim: true
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaKeywords: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    trim: true,
    require: true
  },
  suplierID: {
    type: String,
    ref: 'supplier',
    required: 'Please enter UserID',
    require: true
  },
  cateId: [
    {
      type: String,
      ref: 'cate',
      required: 'Please enter UserID'
    }
  ],
  mannerId: [
    {
      type: String,
      ref: 'manner',
      required: 'Please enter UserID'
    }
  ],
  qty: {
    type: Number,
    trim: true,
    require: true
  }

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
