const Team = require('../../models/Team')

/**
 * Retrieves teams from database
 * @param {object} searchOptions - key-value search options
 * @return {object[]} Found teams
 */
const teams = (searchOptions = {}) => {
  const { ids } = searchOptions

  // Construct DB search object based on
  // provided search params
  let search = {}
  if (ids) {
    // Search for specific set of teams by IDs
    search = {
      ...search,
      _id: {
        $in: [...ids]
      }
    }
  }

  return Team.find(search)
}

module.exports = {
  teams
}