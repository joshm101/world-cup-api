const groupDataAccessor = require('../../accessors/groups')
const matchDataAccessor = require('../../accessors/matches')

/**
 * Calculates final score given an array of
 * goals by half for a match
 * @param {number[]} goalsByHalf - Goals scored in each half.
 * Two elements.
 * @return {number} - Final score
 */
const calculateFinalScore = (goalsByHalf) => {
  if (!goalsByHalf) {
    return null
  }
  if (goalsByHalf.length < 2) {
    return null
  }

  if (goalsByHalf[0] === null || goalsByHalf[1] === null) {
    return null
  }

  const score = goalsByHalf[0] + goalsByHalf[1]
  return score
}

/**
 * Calculates the goalsFor and goalsAgainst
 * stats for each team in a given match
 * @param {object} match - Mongoose Match object 
 */
const matchStats = (match) => {
  const {
    homeTeamGoalsByHalf,
    awayTeamGoalsByHalf
  } = match
  const homeTeamScore = calculateFinalScore(homeTeamGoalsByHalf)
  const awayTeamScore = calculateFinalScore(awayTeamGoalsByHalf)

  if (homeTeamScore !== null && awayTeamScore !== null){
    // goalDifference can be derived from goalsFor - goalsAgainst,
    // so it's probably best not to include that data explicitly.
    // Value can easily be computed by the client.
    return [
      {
        team: match.homeTeam,
        goalsFor: homeTeamScore,
        goalsAgainst: awayTeamScore,
      },
      {
        team: match.awayTeam,
        goalsFor: awayTeamScore,
        goalsAgainst: homeTeamScore,
      }
    ]
  }

  return []
}

/**
 * Generates group standings by team given an array of match stats
 * @param {object} accumulator - Reduction accumulator object
 * @param {object} matchStats - Stats for an individual match
 * (for an individual team)
 * @return {object} - Standings by team lookup object
 */
const generateGroupStandingsByTeam = (accumulator, matchStats) => {
  // get stats for match currently being processed
  const {
    team,
    goalsFor,
    goalsAgainst
  } = matchStats
  
  // get current stats (if they exist in statsByTeam accumulator
  // object) or initialize a stats object
  const currentStats = (
    accumulator[team] ||
    {
      team,
      goalsFor: 0,
      goalsAgainst: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0
    }
  )

  // Update current team stats in statsByTeam accumulator object
  accumulator[team] = {
    team,
    goalsFor: currentStats.goalsFor + goalsFor,
    goalsAgainst: currentStats.goalsAgainst + goalsAgainst,
    wins: currentStats.wins + (
      goalsFor > goalsAgainst ? 1 : 0
    ),
    draws: currentStats.draws + (
      goalsFor === goalsAgainst ? 1 : 0
    ),
    losses: currentStats.losses + (
      goalsFor < goalsAgainst ? 1 : 0
    ),
    points: (() => {
      if (goalsFor > goalsAgainst) {
        return currentStats.points + 3
      }
      if (goalsFor === goalsAgainst) {
        return currentStats.points + 1
      }
      return currentStats.points
    })()
  }

  return accumulator
}

/**
 * Processes a group to construct its sorted group standings
 * @param {object} group - Mongoose Group object
 * @return {object[]} - Sorted group standings objects 
 */
const processIndividualGroup = (group) => {
  const { teams, matches } = group

  // Retrieve matches from database that fall between
  // start of group stage and current time or last
  // day of group stage, whichever date comes before.
  const matchesPromise = matchDataAccessor.matches({
    ids: matches,
    startDate: '2018-06-14',
    endDate: (
      new Date() < new Date('2018-06-29') ?
      new Date() : new Date('2018-06-29')
    )
  })

  // Reduce matches into an array of match stat objects
  const groupMatchesStatsPromise = matchesPromise.then((matches) => {
    return matches.filter(match =>
      !match.inProgress
    ).reduce((statsArray, match) => {
      console.log('MATCH: ', match)
      return statsArray.concat(
        [...matchStats(match)]
      )
    }, [])
  })

  const standingsByTeamPromise = (
    groupMatchesStatsPromise.then((groupMatchesStats) => {
      // process all matches' stats for the current group and construct
      // a final statsByTeam lookup object for each team
      return groupMatchesStats.reduce(generateGroupStandingsByTeam, {})
    })
  )

  return standingsByTeamPromise.then(standingsByTeam =>
    // Turn standingsByTeam lookup object into an array of
    // its object values
    Object.values(
      standingsByTeam
    ).sort((teamStandingA, teamStandingB) => {
      // sort each group standing stats object by its
      // "points" property value.
      return teamStandingB.points - teamStandingA.points
    })
  ).then(sortedGroupStandings =>
    ({
      group: group.name,
      standings: sortedGroupStandings
    })
  )
}

/**
 * Constructs group standings and returns them
 * to client in response
 * @param {object} req - Express request object 
 * @param {object} res - Express response object
 * @return {void} - The function doesn't return
 * a value, but the function triggers response to
 * client
 */
const groupStandings = (req, res) => {
  groupDataAccessor.groups().then(groups =>
    // get all groups from database and construct
    // group standings
    Promise.all(
      groups.map(processIndividualGroup)
    )
  ).then((groupStandings) => {
    res.send({
      // sort group standings array by group name (lexicographically)
      data: groupStandings.sort((groupStandingA, groupStandingB) =>
        groupStandingA.group.localeCompare(groupStandingB.group)
      )
    })
  })
}

module.exports = {
  groupStandings
}
