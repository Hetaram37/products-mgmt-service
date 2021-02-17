'use strict'

const Joi = require('joi')
const AppError = require('../utils/appError')
const SERVICE_CON = 'PMS_PS_'
const {
  createOneProduct,
  aggregateProduct,
  findOneProduct,
  updateOneProduct
} = require('../repository/product.repository')
const { findOneCategory } = require('../repository/category.repository')
const { map } = require('lodash')
const config = require('config')

const addSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.string().required(),
  category: Joi.string().trim().required()
})

// Save new product
const addNewProduct = async (body, files) => {
  console.log('addNewProduct() body: %j, files: %j', body, files)
  await validateInputBody(addSchema, body)
  await createOneProduct(prepareBodyForNewProduct(body, files))
  return 'Success'
}

function prepareBodyForNewProduct (body, files) {
  const images = map(files, 'filename')
  body.slug = `${body.name.replace(' ', '-')}-${new Date().getTime()}`
  body.images = images
  body.cover_image = images[Math.floor(Math.random() * images.length)]
  return body
}

async function validateInputBody (schema, body) {
  try {
    const value = await schema.validateAsync(body)
    console.debug('Validation response: %j', value)
    return value
  } catch (error) {
    console.error('Error while validating input body: %s %j', error, error)
    throw new AppError(null, SERVICE_CON + 206, 'Partial content', error)
  }
}

// List all product for specific category or for all
const listProducts = async (category, page, limit) => {
  const query = await queryForProductList(category, page, limit)
  const productList = await aggregateProduct(query, projectionProductList())
  if (!arrayWithElement(productList)) {
    throw new AppError(null, SERVICE_CON + 204, 'No content', 'No content')
  }
  return productList
}

function arrayWithElement (data) {
  let withElement = false
  if (data && Array.isArray(data) && data.length !== 0) {
    withElement = true
  }
  return withElement
}

async function queryForProductList (category, page, limit) {
  const aggregateQuery = []
  aggregateQuery.push(await getMatchQuery(category))
  aggregateQuery.push(getSortQuery())
  aggregateQuery.push(getProjection())
  aggregateQuery.push(getFacet(limit, page))
  return aggregateQuery
}

async function getMatchQuery (category) {
  const matchQuery = {}
  matchQuery.$match = {}
  if (category) {
    const categoryArray = await getCategoryList(category)
    matchQuery.$match.category = {}
    matchQuery.$match.category.$in = categoryArray
  }
  return matchQuery
}

function getSortQuery () {
  const sortQuery = {}
  sortQuery.$sort = {}
  sortQuery.$sort.created_on = -1
  return sortQuery
}

function getProjection () {
  const projectDetail = {}
  projectDetail.$project = projectionProductList()
  return projectDetail
}

function getFacet (limit, page) {
  const facetQuery = {}
  facetQuery.$facet = {}
  facetQuery.$facet.metadata = []
  facetQuery.$facet.data = []
  facetQuery.$facet.metadata.push(...getMetadata(page, limit))
  facetQuery.$facet.data.push(...getMainData(limit, page))
  return facetQuery
}

function getMetadata (page, limit) {
  const totalCount = {}
  totalCount.$count = 'total'

  const pageNumber = {}
  pageNumber.$addFields = {}
  pageNumber.$addFields.current_page = Number(page)

  const totalPageNumber = {}
  totalPageNumber.$addFields = {}
  totalPageNumber.$addFields.total_page = {}
  totalPageNumber.$addFields.total_page.$divide = ['$total', limit]
  return [totalCount, pageNumber, totalPageNumber]
}

function getMainData (limit, page) {
  const skipObject = {}
  skipObject.$skip = limit * (page - 1)

  const limitObject = {}
  limitObject.$limit = limit
  return [skipObject, limitObject]
}

function projectionProductList () {
  return {
    name: true,
    _id: false,
    tag_id: true,
    description: true,
    slug: true
  }
}

async function getCategoryList (category) {
  console.log('getCategoryList() category: %s', category)
  const categoryDetails = await findOneCategory({ _id: category }, projectionCategoryList())
  const categoryArray = categoryList(categoryDetails)
  return categoryArray
}

function categoryList (category) {
  let categoryArray = []
  if (category && category.path) {
    categoryArray = category.path.split('/')
    categoryArray.push(category._id)
  }
  return categoryArray
}

function projectionCategoryList () {
  return {
    _id: true,
    path: true
  }
}

// Get details of the product using slug
const productDetail = async (slug) => {
  const productData = await findOneProduct({ slug: slug }, productDetailsProjection())
  if (productData) {
    productData.category_hierarchy = await getCategoryHierarchy(productData.category)
    productData.images = getImageFinalPath(productData.images)
    productData.price = productData.price.toLocaleString('en-US', { style: 'currency', currency: 'INR' })
    productData.cover_image = `${config.image.protocol}://${config.image.host}:${config.port}/${productData.cover_image}`
  }
  return productData
}

async function getCategoryHierarchy (category) {
  let categoryHierarchy
  const categoryDetails = await findOneCategory({ _id: category }, projectionCategoryList())
  if (categoryDetails && categoryDetails.path) {
    categoryHierarchy = categoryDetails.path.replace('/', ' -> ')
    categoryHierarchy = `${categoryHierarchy} -> ${category}`
  } else {
    categoryHierarchy = category
  }
  return categoryHierarchy
}

function getImageFinalPath (images) {
  const urls = []
  console.debug('getImageFinalPath() images: %j', images)
  images.forEach(img => {
    urls.push(`${config.image.protocol}://${config.image.host}:${config.port}/${img}`)
  })
  console.debug('getImageFinalPath() images with path: %j', urls)
  return urls
}

function productDetailsProjection () {
  return {
    name: true,
    _id: false,
    tag_id: true,
    description: true,
    slug: true,
    images: true,
    cover_image: true,
    price: true,
    category: true
  }
}

// Update existing product
const updateProduct = async (slug, body, images) => {
  console.log('updateProduct() slug: %s, body: %j, images: %j', slug, body, images)
  await validateInputBody(addSchema, body)
  const updatedData = await updateOneProduct({ slug: slug }, prepareBodyForUpdateProduct(body, images))
  console.log('Updated product data: %j', updatedData)
  if (isDataFoundWithSlug(updatedData)) {
    return 'No data found with the slug'
  }
  if (isUpdateRequired(updatedData)) {
    return 'No update required'
  }
  return 'Success'
}

function isDataFoundWithSlug (updatedData) {
  let isFound = false
  if (updatedData && updatedData.n === 0) {
    isFound = true
  }
  return isFound
}

function isUpdateRequired (updatedData) {
  let isRequired = false
  if (updatedData && updatedData.n === 1 && updatedData.nModified === 0) {
    isRequired = true
  }
  return isRequired
}

function prepareBodyForUpdateProduct (body, files) {
  console.log('files: ', files.cover_image[0])
  const images = map(files.images, 'filename')
  body.images = images
  body.cover_image = files.cover_image[0].filename
  return body
}

module.exports = {
  addNewProduct,
  listProducts,
  productDetail,
  updateProduct
}
