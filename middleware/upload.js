'use strict'

const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/')
  },
  filename: (req, file, callback) => {
    const fileName = Date.now() + '_' + file.originalname.toLowerCase().split(' ').join('-')
    console.debug('File name: ', fileName)
    callback(null, fileName)
  }
})

const uploadFiles = multer({
  storage: storage
})

module.exports = {
  uploadFiles
}
