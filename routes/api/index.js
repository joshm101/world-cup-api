const express = require('express')
const api = express.Router()

const matchesRouter = require('./matches')

api.get('/', (req, res, next) => {
  res.send('API')
})

api.use('/matches', matchesRouter)

module.exports = api