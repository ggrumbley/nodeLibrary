const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema

const AuthorSchema = Schema({
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

// Virtual View for this author instance URL
AuthorSchema
  .virtual('url')
  .get(function () { return `/catalog/author/${this._id}` })

// Virtual View for author "full" name
AuthorSchema
  .virtual('name')
  .get(function() { return `${this.family_name}, ${this.first_name}` })

AuthorSchema
  .virtual('lifespan')
  .get(function() {
    const birth = this.date_of_birth
    const death = this.date_of_death
    if (birth && death) {
      return`${moment(birth).format('MMMM Do, YYYY')} - ${moment(death).format('MMMM Do, YYYY')}`
    } else if (birth) {
      return `${moment(birth).format('MMMM Do, YYYY')}`
    }
    return 'Unknown'
  })

module.exports = mongoose.model('Author', AuthorSchema)
