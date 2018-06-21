const express = require('express')
const api = express.Router()

const matchesRouter = require('./matches')
const groupsRouter = require('./groups')

api.get('/', (req, res, next) => {
  res.send('API')
})

api.use('/matches', matchesRouter)
api.use('/groups', groupsRouter)

module.exports = api