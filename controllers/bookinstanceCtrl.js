const BookInstance = require('../models/bookinstance')
const Book = require('../models/book')

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
  Book.find({}, 'title')
    .exec((err, books) => {
      if (err) { return next(err) }
      res.render('bookinstance_form', { title: 'Create BookInstance', books })
    })
}

exports.bookinstance_create_post = (req, res, next) => {
  req.checkBody('book', 'Book must be specified').notEmpty();
  req.checkBody('imprint', 'Imprint must be specified').notEmpty();
  req.checkBody('due_back', 'Invalid date').optional({ checkFalsy: true }).isDate();

  req.sanitize('book').escape();
  req.sanitize('imprint').escape();
  req.sanitize('status').escape();
  req.sanitize('book').trim();
  req.sanitize('imprint').trim();
  req.sanitize('status').trim();
  req.sanitize('due_back').toDate();

  const errors = req.validationErrors()
  const bookInstance = new BookInstance({
    book: req.body.book,
    imprint: req.body.imprint,
    status: req.body.status,
    due_back: req.body.due_back,
  })

  if (errors) {
    Book.find({}, 'title')
      .exec((err, books) => {
        if(err) { return next(err) }
        res.render('bookinstance_form', {
          title: 'Create BookInstance',
          selected_book: bookInstance.book._id,
          books,
          errors,
          bookInstance,
        })
      })
      return
  } else {
    bookInstance.save((err) => {
      if (err) { return next(err) }
      res.redirect(bookInstance.url)
    })
  }
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
