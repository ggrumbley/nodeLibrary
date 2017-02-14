const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuthorSchema = Schema(
  {
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
  }
)

// Virtual View for author "full" name
AuthorSchema
  .virtual('name')
  .get(() => `${this.family_name}, ${this.first_name}`)


// Virtual View for this author instance URL
AuthorSchema
  .virtual('url')
  .get(() => `/catalog/author/${this._id}`)

module.exports = mongoose.model('Author', AuthorSchema)
