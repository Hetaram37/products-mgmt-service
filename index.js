'use strict'

const path = require('path')
const express = require('express')
const helmet = require('helmet')
const app = express()
const http = require('http')
const config = require('config')

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP headers
app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

const dbUtil = require('./lib/db')(config.database)
dbUtil.connect()
global.db = dbUtil

// const connection = mongoose
//   .connect('mongodb://127.0.0.1:27017/my_product', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('DB connection successful!'))

// autoIncrement.initialize(connection)
require('./routes')(app)

app.all('*', (req, res, next) => {
  res.status(404).json({
    data: null,
    status_code: 'PMS_' + 404,
    status_message: 'Path not found',
    errors: `Can't find ${req.originalUrl} on this server!`
  })
})

const server = http.createServer(app)

const port = config.port || 3000
server.listen(port, () => {
  console.log(`Product Mgmt running on port ${port}.`)
})

module.exports = app
