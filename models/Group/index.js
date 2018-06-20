const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema

const GroupSchema = new Schema({
  teams: [ObjectId],
  matches: [ObjectId],
  name: String
})

const Group = mongoose.model('Group', GroupSchema)

module.exports = Group