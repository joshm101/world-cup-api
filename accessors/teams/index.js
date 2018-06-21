const Team = require('../../models/Team')

/**
 * Retrieves teams from the DB by their IDs
 * @param {ObjectID[]} ids - IDs of teams to
 * retrieve
 * @return {Promise<Team[]>} - Teams array
 * wrapped in a Promise
 */
const teamsById = (ids = []) => {
  // Map over ID array and retrieve
  // each Team
  return Promise.all(
    ids.map(_id =>
      Team.findOne({
        _id
      })
    )
  )
}

module.exports = {
  teamsById
}