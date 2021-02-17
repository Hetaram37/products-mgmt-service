'use strict'

const {
  addNewCategory,
  listCategory
} = require('../services/category.service')
const {
  getStatusCode
} = require('../utils/statusCode')
const CONTROLLER_CONS = 'PMS_CC_'

const addCategory = async (req, res) => {
  try {
    const respose = await addNewCategory(req.body)
    res.status(201).json({
      data: respose,
      status_code: CONTROLLER_CONS + 200,
      status_message: 'Success',
      errors: null
    })
  } catch (error) {
    console.error('Error while adding new category: %s %j', error, error)
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

const categoryList = async (req, res) => {
  try {
    const parent = req.params.parent
    const respose = await listCategory(parent)
    res.status(200).json({
      data: respose,
      status_code: CONTROLLER_CONS + 200,
      status_message: 'Success',
      errors: null
    })
  } catch (error) {
    console.error('Error while getting category list: %s %j', error, error)
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
  addCategory,
  categoryList
}
