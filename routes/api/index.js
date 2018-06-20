const express = require('express')
const api = express.Router()

api.get('/', (req, res, next) => {
  res.send('API')
})

module.exports = api