const express = require('express')
const matches = express.Router()

const matchesController = require('../../../controllers/matches')

matches.get('/', matchesController.matches)

module.exports = matches
