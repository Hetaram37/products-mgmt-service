'use strict'

const config = require('config')
require('../model/products')

exports.findOneProduct = async (query, projection) => {
  console.debug('Find single data query: %j, projection: %j', query, projection)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const productDetails = db.model('products')
    const doc = await productDetails.findOne(query, projection).lean()
    return doc
  } catch (error) {
    console.error('Error while getting data from products: %s %j', error, error)
    throw error
  }
}

exports.findProduct = async (query, projection) => {
  console.debug('Find data query: %j, projection: %j', query, projection)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const productDetails = db.model('products')
    const doc = await productDetails.find(query, projection).lean()
    return doc
  } catch (error) {
    console.error('Error while getting data from products: %s %j', error, error)
    throw error
  }
}

exports.aggregateProduct = async (query) => {
  console.debug('Find data using aggreate: %j', query)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const productDetails = db.model('products')
    const doc = await productDetails.aggregate(query)
    return doc
  } catch (error) {
    console.error('Error while getting data from products: %s %j', error, error)
    throw error
  }
}

exports.findByIdProduct = async (id, projection) => {
  console.debug('Find by id, id: %s, projection: %j', id, projection)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const productDetails = db.model('products')
    const doc = await productDetails.findById(id, projection).lean()
    return doc
  } catch (error) {
    console.error('Error while getting data from products: %s %j', error, error)
    throw error
  }
}

exports.updateOneProduct = async (query, data, projection) => {
  console.debug('Update one data query: %j, data: %j, projection: %j', query, data, projection)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const productDetails = db.model('products')
    const doc = await productDetails.updateOne(query, data, projection)
    return doc
  } catch (error) {
    console.error('Error while updating data in products collection: %s %j', error, error)
    throw error
  }
}

exports.findByIdAndUpdateProduct = async (id, data, options) => {
  console.debug('Update single data by id id: %s, data: %j, options: %j ', id, data, options)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const productDetails = db.model('products')
    const doc = await productDetails.findByIdAndUpdate(id, data, options)
    return doc
  } catch (error) {
    console.error('Error while updating data in products collection: %s %j', error, error)
    throw error
  }
}

exports.createOneProduct = async (data) => {
  console.log('Creating new doc: %j', data)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const productDetails = db.model('products')
    const product = await productDetails.create(data)
    return product
  } catch (error) {
    console.error('Error while saving data to products : %s %j', error, error)
    throw error
  }
}
