const BookInstance = require('../models/bookInstance')

exports.bookinstance_list = (req, res, next) => {
  res.send('BookInstance list')
}

exports.bookinstance_detail = (req, res, next) => {
  res.send(`BookInstance detail ${req.params.id}`)
}

exports.bookinstance_create_get = (req, res, next) => {
  res.send('BookInstance create GET')
}

exports.bookinstance_create_post = (req, res, next) => {
  res.send('BookInstance create POST')
}

exports.bookinstance_delete_get = (req, res, next) => {
  res.send('BookInstance delete GET')
}

exports.bookinstance_delete_post = (req, res, next) => {
  res.send('BookInstance delete POST')
}

exports.bookinstance_update_get = (req, res, next) => {
  res.send('BookInstance update GET')
}

exports.bookinstance_update_post = (req, res, next) => {
  res.send('BookInstance update POST')
}
