'use strict'

const {
  addNewProduct,
  listProducts,
  productDetail,
  updateProduct
} = require('../services/product.service')
const {
  getStatusCode
} = require('../utils/statusCode')
const CONTROLLER_CONS = 'PMS_CC_'

const addProduct = async (req, res) => {
  try {
    const respose = await addNewProduct(req.body, req.files)
    res.status(201).json({
      data: respose,
      status_code: CONTROLLER_CONS + 200,
      status_message: 'Success',
      errors: null
    })
  } catch (error) {
    console.error('Error while adding new product: %s %j', error, error)
    if (getStatusCode(error.status_code)) {
      res.status(getStatusCode(error.status_code)).send(error)
    } else {
      res.status(500).json({
        data: null,
        status_code: CONTROLLER_CONS + 500,
        status_message: 'Server error',
        errors: error
      })
    }
  }
}

const productList = async (req, res) => {
  try {
    const category = req.query.category
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const respose = await listProducts(category, page, limit)
    res.status(200).json({
      data: respose,
      status_code: CONTROLLER_CONS + 200,
      status_message: 'Success',
      errors: null
    })
  } catch (error) {
    console.error('Error while getting product list: %s %j', error, error)
    if (getStatusCode(error.status_code)) {
      res.status(getStatusCode(error.status_code)).send(error)
    } else {
      res.status(500).json({
        data: null,
        status_code: CONTROLLER_CONS + 500,
        status_message: 'Server error',
        errors: error
      })
    }
  }
}

const getProduct = async (req, res) => {
  try {
    const slug = req.params.slug
    const respose = await productDetail(slug)
    res.status(200).json({
      data: respose,
      status_code: CONTROLLER_CONS + 200,
      status_message: 'Success',
      errors: null
    })
  } catch (error) {
    console.error('Error while getting product details: %s %j', error, error)
    if (getStatusCode(error.status_code)) {
      res.status(getStatusCode(error.status_code)).send(error)
    } else {
      res.status(500).json({
        data: null,
        status_code: CONTROLLER_CONS + 500,
        status_message: 'Server error',
        errors: error
      })
    }
  }
}

const productUpdate = async (req, res) => {
  try {
    const slug = req.params.slug
    const respose = await updateProduct(slug, req.body, req.files)
    res.status(200).json({
      data: respose,
      status_code: CONTROLLER_CONS + 200,
      status_message: 'Success',
      errors: null
    })
  } catch (error) {
    console.error('Error while update product: %s %j', error, error)
    if (getStatusCode(error.status_code)) {
      res.status(getStatusCode(error.status_code)).send(error)
    } else {
      res.status(500).json({
        data: null,
        status_code: CONTROLLER_CONS + 500,
        status_message: 'Server error',
        errors: error
      })
    }
  }
}

module.exports = {
  addProduct,
  productList,
  getProduct,
  productUpdate
}
