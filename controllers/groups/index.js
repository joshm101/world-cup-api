const groupDataAccessor = require('../../accessors/groups')
const teamDataAccessor = require('../../accessors/teams')
const matchDataAccessor = require('../../accessors/matches')

/**
 * Expands a group object by retrieving its associated
 * team objects and match objects
 * @param {object} group - Mongoose Group object
 * @return {Promise<object>} - Expanded group object Promise 
 */
const expandGroup = (group) => {
  const { teams, matches } = group

  // Retrieve match objects from database
  const matchIds = matches.map(match => match._id)
  const matchesSearch = {
    ids: matchIds
  }
  const matchesPromise = matchDataAccessor.matches(matchesSearch)
  
  // Retrieve team objects from database
  const teamIds = teams.map(team => team._id)
  const teamsPromise = teamDataAccessor.teams({ ids: teamIds })

  // Return new object containing group data
  // along with expanded teams and matches arrays
  return Promise.all([
    teamsPromise,
    matchesPromise
  ]).then(([teams, matches]) => {
    const { _id, name } = group
    return {
      _id,
      name,
      teams,
      matches
    }
  })
}

/**
 * Responds to client with requested groups from database
 * @param {object} req - Express request object 
 * @param {object} res - Express response object
 * @return {object} - Express response 
 */
const groups = (req, res) => {
  const expanded = req.query.expanded == 1

  const groupsPromise = groupDataAccessor.groups()

  if (!expanded) {
    return groupsPromise.then(groups =>
      res.send({
        data: groups
      })
    )
  }

  const expandedGroups = groupsPromise.then((groups) => {
    return Promise.all(
      groups.map(expandGroup)
    )
  })

  expandedGroups.then(groups =>
    res.send({
      data: groups
    })
  )
}

module.exports = {
  groups
}
