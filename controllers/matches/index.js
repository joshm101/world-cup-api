const matchDataAccessor = require('../../accessors/matches')
const teamDataAccessor = require('../../accessors/teams')

/**
 * Retrieves matches from DB. Supports the following
 * query params:
 * - start_date: Date parseable by Date()
 * - end_date: Date parseable by Date()
 * @param {object} req - Express request object 
 * @param {object} res - Express response object
 * @return {object} - Express response 
 */
const matches = (req, res) => {
  const expanded = req.query.expanded == 1
  const startDate = req.query.start_date
  const endDate = req.query.end_date

  const matches = matchDataAccessor.matches({
    startDate,
    endDate
  }).catch((error) => {
    console.error('Error while retrieving matches: ', error.message)
    res.status(500).send({
      message: 'An unknown error occurred while retrieving match data.'
    })
  })

  if (!expanded) {
    // Consumer did not request nested data to be
    // expanded, return retrieved matches
    matches.then(matches =>
      res.send({
        data: matches
      })
    )
    return
  }

  // Consumer requested nested data to be
  // expanded, perform additional DB queries
  return matches.then((matches) => {
    return Promise.all(

      // Map over each match and retrieve corresponding
      // homeTeam and awayTeam objects
      matches.map((match) => {
        const teamIds = [match.homeTeam, match.awayTeam]
        const teams = teamDataAccessor.teams(
          { ids: teamIds }
        ).catch((error) => {
          console.error(
            'Error occurred while expanding team data: ', error.message
          )
          const message = (
            'An unknown error occured while expanding match team data.'
          )
          res.status(500).send({
            message
          })
          return
        })

        // Return Match with expanded homeTeam
        // and awayTeam data
        return teams.then(([homeTeam, awayTeam]) => {
          const {
            _id,
            date,
            homeTeamGoalsByHalf,
            awayTeamGoalsByHalf
          } = match
          return {
            _id,
            date,
            homeTeamGoalsByHalf,
            awayTeamGoalsByHalf,
            homeTeam,
            awayTeam,
            inProgress: !!match.inProgress
          }
        })
      })
    )
  }).then((expandedMatches) => {
    res.send({
      data: expandedMatches
    })
  })
}

module.exports = {
  matches
}