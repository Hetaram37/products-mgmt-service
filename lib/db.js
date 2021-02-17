const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { autoIncrement } = require('mongoose-plugin-autoinc')
const _ = require('lodash')
const config = require('config')

const connections = {}

module.exports = (opts) => {
  this.opts = _.cloneDeep(opts)
  this.opts.host = this.opts.host || 'localhost:27017'

  const connect = async (dbName) => {
    if (!this.opts) {
      this.opts = config.database
    }

    dbName = dbName || this.opts.default_db_name

    if (connections[dbName]) {
      console.debug('connect() connection exists')
      return connections[dbName]
    }

    connections[dbName] = await createNewConnection(this.opts, dbName)
    connections[dbName].once('open', function callback () {
      console.debug('connect() MongoDB connected successfully')
    })
    return connections[dbName]
  }
  return { connect, autoIncrement }
}

async function createNewConnection (opts, dbName) {
  const url = 'mongodb+srv://admin:<password>@cluster0.2sdjj.mongodb.net/my_product?retryWrites=true&w=majority'
  const mongoOptions = opts.mongo_options

  if (opts.authentication) {
    mongoOptions.user = opts.user || config.database.user
    mongoOptions.pass = opts.pass || config.database.pass
    mongoOptions.authSource = opts.auth_source
  }
  return mongoose.createConnection(url, mongoOptions)
}
