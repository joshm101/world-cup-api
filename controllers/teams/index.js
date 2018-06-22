const teamDataAccessor = require('../../accessors/teams')
const matchDataAccessor = require('../../accessors/matches')

/**
 * "Expands" a team by retrieving its
 * nested match data objects
 * @param {object} team - Mongoose Team object
 * @return {object} - Team with expanded match data
 */
const expandTeam = (team) => {
  const { matches } = team

  const matchesPromise = matchDataAccessor.matches({
    ids: matches
  }).catch((error) => {
    throw new Error(error.message)
  })

  return matchesPromise.then(matches =>
    ({
      _id: team.id,
      logo: team.logo,
      matches
    })
  )
}

/**
 * Responds to client with requested teams from database
 * @param {object} req - Express request object 
 * @param {object} res - Express response object 
 */
const teams = (req, res) => {
  const { expanded } = req.query
  
  const teamsPromise = teamDataAccessor.teams()

  teamsPromise.then((teams) => {
    if (!expanded) {
      // client did not request expanded matches, respond
      // with array of teams
      res.send({
        data: teams
      })
      return
    }

    // client requested expanded matches, retrieve match data 
    // and respond
    const expandedTeamsPromise = Promise.all(
      teams.map(expandTeam)
    ).catch((error) => {
      console.error('Error while retrieving matches: ', error.message)
      res.status(500).send({
        message: 'An unknown error occurred while retrieving match data for teams.'
      })
      return
    })

    expandedTeamsPromise.then(teams =>
      res.send({
        data: teams
      })
    )
  })
}

module.exports = {
  teams
}