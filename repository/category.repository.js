'use strict'

const config = require('config')
require('../model/categories')

exports.findOneCategory = async (query, projection) => {
  console.debug('Find single data query: %j, projection: %j', query, projection)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const categoryDetails = db.model('categories')
    const category = await categoryDetails.findOne(query, projection).lean()
    return category
  } catch (error) {
    console.error('Error while getting data from categories: %s %j', error, error)
    throw error
  }
}

exports.findCategory = async (query, projection) => {
  console.debug('Find data query: %j, projection: %j', query, projection)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const categoryDetails = db.model('categories')
    const category = await categoryDetails.find(query, projection).lean()
    return category
  } catch (error) {
    console.error('Error while getting data from categories: %s %j', error, error)
    throw error
  }
}

exports.findByIdCategory = async (id, projection) => {
  console.debug('Find by id, id: %s, projection: %j', id, projection)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const categoryDetails = db.model('categories')
    const category = await categoryDetails.findById(id, projection).lean()
    return category
  } catch (error) {
    console.error('Error while getting data from categories: %s %j', error, error)
    throw error
  }
}

exports.updateOneCategory = async (query, data, projection) => {
  console.debug('Update one data query: %j, data: %j, projection: %j', query, data, projection)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const categoryDetails = db.model('categories')
    const category = await categoryDetails.updateOne(query, data, projection)
    return category
  } catch (error) {
    console.error('Error while updating data in categories collection: %s %j', error, error)
    throw error
  }
}

exports.findByIdAndUpdateCategory = async (id, data, options) => {
  console.debug('Update single data by id id: %s, data: %j, options: %j ', id, data, options)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const categoryDetails = db.model('categories')
    const category = await categoryDetails.findByIdAndUpdate(id, data, options)
    return category
  } catch (error) {
    console.error('Error while updating data in categories collection: %s %j', error, error)
    throw error
  }
}

exports.createOneCategory = async (data) => {
  console.log('Creating new category: %j', data)
  try {
    const database = config.get('database')
    const tenant = database.get('default_db_name')
    const db = await global.db.connect(tenant)
    const categoryDetails = db.model('categories')
    const category = await categoryDetails.create(data)
    return category
  } catch (error) {
    console.error('Error while saving data to categories: %s %j', error, error)
    throw error
  }
}
