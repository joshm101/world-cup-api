const express = require('express')
const api = express.Router()

const matchesRouter = require('./matches')
const groupsRouter = require('./groups')
const groupStandingsRouter = require('./group-standings')
const teamsRouter = require('./teams')

api.get('/', (req, res, next) => {
  res.send('API')
})

api.use('/matches', matchesRouter)
api.use('/groups', groupsRouter)
api.use('/group-standings', groupStandingsRouter)
api.use('/teams', teamsRouter)

module.exports = api