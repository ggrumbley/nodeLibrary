const Author = require('../models/author')
const Book = require('../models/book')

const async = require('async')

exports.authors = (req, res, next) => {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec((err, authors) => {
      if (err) { return next(err) }
      res.render('authors', { title: 'Author List', authors })
    })
}

exports.author_detail = (req, res, next) => {
  async.parallel({
    author: (f) => Author.findById(req.params.id).exec(f),
    authors_books: (f) => Book.find({ 'author': req.params.id }, 'title summary').exec(f)
  },

  (err, results) => {
    if (err) { return next(err) }
    res.render('author_detail', {
      title: 'Author Detail',
      author: results.author,
      author_books: results.authors_books,
    })
  })
}

exports.author_create_get = (req, res, next) => {
  res.send('Auther create GET')
}

exports.author_create_post = (req, res, next) => {
  res.send('Auther create POST')
}

exports.author_delete_get = (req, res, next) => {
  res.send('Auther delete GET')
}

exports.author_delete_post = (req, res, next) => {
  res.send('Auther delete POST')
}

exports.author_update_get = (req, res, next) => {
  res.send('Auther update GET')
}

exports.author_update_post = (req, res, next) => {
  res.send('Auther update POST')
}
