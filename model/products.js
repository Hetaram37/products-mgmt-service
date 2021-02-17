'use strict'

const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  tag_id: String,
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  images: {
    type: Array,
    required: [true, 'Product images is required']
  },
  cover_image: {
    type: String,
    required: [true, 'Product cover image is required']
  },
  category: {
    type: String,
    ref: 'categories',
    required: [true, 'Category is required']
  }
}, {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  },
  collection: 'products'
})

// Auto Increment the value of tag_id
productSchema.plugin(global.db.autoIncrement, {
  model: 'products',
  field: 'tag_id',
  startAt: 1
})

module.exports = mongoose.model('products', productSchema)
