'use strict'

const categoryRoute = require('./category.route')
const productRoute = require('./product.route')

module.exports = (app) => {
  app.use('/api/category', categoryRoute)
  app.use('/api/product', productRoute)
}
