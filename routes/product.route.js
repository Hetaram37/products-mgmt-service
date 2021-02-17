const route = require('express').Router()
const {
  addProduct,
  productList,
  getProduct,
  productUpdate
} = require('../controllers/product.controller')
const { uploadFiles } = require('../middleware/upload')

route.post('/v1', uploadFiles.array('images', 5), addProduct)
route.get('/v1', productList)
route.get('/v1/:slug', getProduct)
route.put('/v1/:slug', uploadFiles.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]), productUpdate)

module.exports = route
