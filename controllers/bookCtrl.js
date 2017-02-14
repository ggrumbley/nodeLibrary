const Book = require('../models/book');

exports.index = (req, res, next) => {
  res.send('Site HomePage')
}

exports.book_list = (req, res, next) => {
  res.send('Book list')
}

exports.book_detail = (req, res, next) => {
  res.send(`Book detail ${req.params.id}`)
}

exports.book_create_get = (req, res, next) => {
  res.send('Book create GET')
}

exports.book_create_post = (req, res, next) => {
  res.send('Book create POST')
}

exports.book_delete_get = (req, res, next) => {
  res.send('Book delete GET')
}

exports.book_delete_post = (req, res, next) => {
  res.send('Book delete POST')
}

exports.book_update_get = (req, res, next) => {
  res.send('Book update GET')
}

exports.book_update_post = (req, res, next) => {
  res.send('Book update POST')
}
