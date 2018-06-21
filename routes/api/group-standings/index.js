const express = require('express')
const groupStandings = express.Router()

const groupStandingsController = require('../../../controllers/group-standings')

groupStandings.get('/', groupStandingsController.groupStandings)

module.exports = groupStandings
