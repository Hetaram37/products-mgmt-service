'use strict'

const mongoose = require('mongoose')
mongoose.set('debug', true)

const categorySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, 'Category name is required']
  },
  path: String
}, {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  },
  collection: 'categories'
})

module.exports = mongoose.model('categories', categorySchema)
