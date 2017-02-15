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
  res.render('author_form', { title: 'Create Author' })
}

exports.author_create_post = (req, res, next) => {
  req.checkBody('first_name', 'First name must be specified.').notEmpty();
  req.checkBody('family_name', 'Family name must be specified.').notEmpty();
  req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
  req.checkBody('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isDate();
  req.checkBody('date_of_death', 'Invalid date').optional({ checkFalsy: true }).isDate();
  req.sanitize('first_name').escape();
  req.sanitize('family_name').escape();
  req.sanitize('first_name').trim();
  req.sanitize('family_name').trim();
  req.sanitize('date_of_birth').toDate();
  req.sanitize('date_of_death').toDate();

  const errors = req.validationErrors();
  const author = new Author({
    first_name: req.body.first_name,
    family_name: req.body.family_name,
    date_of_birth: req.body.date_of_birth,
    date_of_death: req.body.date_of_death
  })

  if (errors) {
    res.render('author_form', { title: 'Create Author', author, errors })
    return
  } else {
    author.save((err) => {
      if (err) { return next(err) }
      res.redirect(author.url)
    })
  }
}

exports.author_delete_get = (req, res, next) => {
  async.parallel({
    author: (f) => Author.findById(req.params.id).exec(f),
    authors_books: (f) => Book.find({ 'author': req.params.id }).exec(f),
  },

  (err, results) => {
    if (err) { return next(err) }
    res.render('author_delete', {
      title: 'Delete Author',
      author: results.author,
      author_books: results.authors_books,
    })
  })
}

exports.author_delete_post = (req, res, next) => {
  req.checkBody('authorid', 'Author id must exist').notEmpty()

  async.parallel({
    author: (f) => Author.findById(req.body.authorid).exec(f),
    authors_books: (f) => Book.find({ 'author': req.body.authorid }, 'title summary').exec(f),
  },
  (err, results) => {
    if (err) { return next(err) }
    if (results.authors_books > 0) {
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.authors_books
      })
      return
    } else {
      Author.findByIdAndRemove(req.body.authorid, (err) => {
        if (err) { return next(err) }
        res.redirect('/catalog/authors')
      })
    }
  })
}

exports.author_update_get = (req, res, next) => {
  res.send('Auther update GET')
}

exports.author_update_post = (req, res, next) => {
  res.send('Auther update POST')
}
