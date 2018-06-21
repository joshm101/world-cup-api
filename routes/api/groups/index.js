const express = require('express')
const groups = express.Router()

const groupsController = require('../../../controllers/groups')

groups.get('/', groupsController.groups)

module.exports = groups
