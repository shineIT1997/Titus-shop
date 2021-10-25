let mongoose = require('mongoose')
let Schema = mongoose.Schema

let schema = new Schema({
  supId: {
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
  },
  cateId: [
    {
      type: String,
      ref: 'cate',
      required: 'Please enter Cate'
    }
  ],
  mannerId: [
    {
      type: String,
      ref: 'manner',
      required: 'Please enter UserID'
    }
  ]
})

const options = {
  collection: 'supplier',
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
}

module.exports = {
  schema,
  options
}
