'use strict'

const { findOneCategory, findByIdAndUpdateCategory, findCategory } = require('../repository/category.repository')
const AppError = require('../utils/appError')
const SERVICE_CON = 'PMS_CS_'
const { map } = require('lodash')

// Add new category
const addNewCategory = async (body) => {
  console.log('addNewCategory() body: %j', body)
  body.parent = await createParentCat(body.parent)
  await findByIdAndUpdateCategory(body.name, bodyForCategory(body.name, body.parent), { upsert: true })
  return 'Success'
}

async function createParentCat (parent) {
  if (parent) {
    const parentDetails = await findOneCategory(categoryQuery(parent), categoryProjection())
    console.log('Parent details: %j', parentDetails)
    if (parentDetails) {
      if (parentDetails.path && !parentDetails.path.includes(parent)) {
        parent = `${parentDetails.path}/${parent}`
      }
    }
  }
  return parent
}

function categoryQuery (parent) {
  return {
    _id: parent
  }
}

function categoryProjection () {
  return {
    _id: true,
    path: true
  }
}

function bodyForCategory (name, parent) {
  console.log('bodyForCategory() name: %s, parent: %s', name, parent)
  const body = {}
  body._id = name
  body.path = parent
  console.log('bodyForCategory() body: %j', body)
  return body
}

// List all sub category for parent category
const listCategory = async (parent) => {
  const categoryDetails = await findCategory(queryCategoryList(parent), categoryProjection())
  let path
  console.log('category details: %j', categoryDetails)
  if (isValidCategoryDetails(categoryDetails)) {
    path = map(categoryDetails, '_id')
    return path
  }
  throw new AppError(null, SERVICE_CON + 204, 'No data found', 'No data found')
}

function isValidCategoryDetails (categoryDetails) {
  let isValid = false
  if (categoryDetails && Array.isArray(categoryDetails) && categoryDetails.length !== 0) {
    isValid = true
  }
  return isValid
}

function queryCategoryList (parent) {
  const query = {}
  query.path = new RegExp(`${parent}`, 'i')
  return query
}

module.exports = {
  addNewCategory,
  listCategory
}
