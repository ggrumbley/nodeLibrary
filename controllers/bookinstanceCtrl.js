const BookInstance = require('../models/bookinstance')

exports.bookinstances = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec((err, bookinstances) => {
      if (err) { return next(err) }
      res.render('bookinstances', { title: 'Book Instance List', bookinstances })
    })
}

exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id).populate('book')
    .exec((err, bookinstance) => {
      if (err) { return next(err) }
      res.render('bookinstance_detail', { title: 'Book', bookinstance })
    })
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
