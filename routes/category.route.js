const route = require('express').Router()
const {
  addCategory,
  categoryList
} = require('../controllers/category.controller')

route.post('/v1', addCategory)
route.get('/v1/:parent', categoryList)

module.exports = route
