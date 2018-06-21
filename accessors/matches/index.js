const Match = require('../../models/Match')

/**
 * Retrieves matches from database
 * @param {object} searchOptions - key-value search options
 * @param {object} sortOptions - key-value sort options
 * @return {objet[]} Found matches 
 */
const matches = (searchOptions = {}, sortOptions = { date: 1 }) => {
  const {
    startDate,
    endDate
  } = searchOptions

  // Construct DB search object based on
  // provided search params
  let search = {}
  if (startDate) {
    search = {
      date: {
        $gte: new Date(startDate)
      }
    }
  }
  if (endDate) {
    search = {
      ...search,
      date: {
        ...search.date,
        $lt: new Date(endDate)
      }
    }
  }

  return Match.find(search).sort(sortOptions)
}

module.exports = {
  matches
}