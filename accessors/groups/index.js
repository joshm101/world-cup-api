const Group = require('../../models/Group')

const groups = (searchOptions = {}, sortOptions = { name: 1 }) => {
  return Group.find(searchOptions).sort(sortOptions)
}

module.exports = {
  groups
}
