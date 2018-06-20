const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema

const MatchSchema = new Schema({
  date: Date,
  homeTeam: ObjectId,
  awayTeam: ObjectId,
  homeTeamGoalsByHalf: [Number],
  awayTeamGoalsByHalf: [Number]
})

/**
 * Derives the total home team goals from
 * homeTeamGoalsByHalf
 * @return {number} - total home team goals
 */
MatchSchema.method.homeTeamGoals = function() {
  return this.homeTeamGoalsByHalf[0] + this.homeTeamGoalsByHalf[1]
}

/**
 * Dervies the the total away team goals
 * from awayTeamGoalsByHalf
 * @return {number} - total away team goals
 */
MatchSchema.method.awayTeamGoals = function() {
  return this.awayTeamGoalsByHalf[0] + this.awayTeamGoalsByHalf[1]
}

const Match = mongoose.model('Match', MatchSchema)

module.exports = Match