const express = require('express')
const teams = express.Router()

const teamsController = require('../../../controllers/teams')

teams.get('/', teamsController.teams)

module.exports = teams
