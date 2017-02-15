const Genre = require('../models/genre')
const Book = require('../models/book')

const async = require('async')

exports.genres = (req, res, next) => {
  Genre.find().exec((err, genres) => {
    if (err) { return next(err) }
    res.render('genres', { title: 'Genres', genres })
  })
}

exports.genre_detail = (req, res, next) => {
  async.parallel({
    genre: (f) => Genre.findById(req.params.id).exec(f),
    genre_books: (f) => Book.find({ 'genre': req.params.id }).exec(f)
  },

  (err, results) => {
    if (err) { return next(err) }
    res.render('genre_detail', {
      title: 'Genre Detail',
      genre: results.genre,
      genre_books: results.genre_books
    })
  })
}

exports.genre_create_get = (req, res, next) => {
  res.send('Genre create GET')
}

exports.genre_create_post = (req, res, next) => {
  res.send('Genre create POST')
}

exports.genre_delete_get = (req, res, next) => {
  res.send('Genre delete GET')
}

exports.genre_delete_post = (req, res, next) => {
  res.send('Genre delete POST')
}

exports.genre_update_get = (req, res, next) => {
  res.send('Genre update GET')
}

exports.genre_update_post = (req, res, next) => {
  res.send('Genre update POST')
}
