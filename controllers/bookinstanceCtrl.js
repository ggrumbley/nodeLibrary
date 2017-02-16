const BookInstance = require('../models/bookinstance')
const Book = require('../models/book')

const async = require('async')

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

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res, next) {
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec(function (err, bookInstance) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('bookinstance_delete', { title: 'Delete BookInstance', bookInstance });
  })
};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res, next) {
  //Assume valid bookinstance id in field (should check)
  BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
    if (err) { return next(err); }
    //success, so redirect to list of bookinstances.
    res.redirect('/catalog/bookinstances')
  });
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res, next) {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  //Get book, authors and genres for form
  async.parallel({
      bookInstance: function(callback) {
          BookInstance.findById(req.params.id).populate('book').exec(callback)
      },
      books: function(callback) {
          Book.find(callback)
      },

      }, function(err, results) {
          if (err) { return next(err); }

          res.render('bookinstance_form', { title: 'Update  BookInstance', books: results.books, selected_book: results.bookInstance.book._id, bookInstance: results.bookInstance });
      });
};

// Handle bookinstance update on POST
exports.bookinstance_update_post = function(req, res, next) {

  req.sanitize('id').escape();
  req.sanitize('id').trim();

  req.checkBody('book', 'Book must be specified').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
  req.checkBody('imprint', 'Imprint must be specified').notEmpty();
  req.checkBody('due_back', 'Invalid date').optional({ checkFalsy: true }).isDate();

  req.sanitize('book').escape();
  req.sanitize('imprint').escape();
  req.sanitize('status').escape();
  req.sanitize('book').trim();
  req.sanitize('imprint').trim();
  req.sanitize('status').trim();
  req.sanitize('due_back').toDate();


  const errors = req.validationErrors();
  const bookinstance = new BookInstance(
    { book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id
     });

  if (errors) {
    Book.find({},'title')
    .exec((err, books) => {
      if (err) { return next(err); }
      //Successful, so render
      res.render('bookinstance_form', {
        title: 'Update BookInstance',
        selected_book: bookinstance.book._id,
        bookinstance,
        books,
        errors,
      });
    });
    return;
  } else {
    // Data from form is valid
    BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err,thebookinstance) {
      if (err) { return next(err) }
      //successful - redirect to genre detail page.
      res.redirect(thebookinstance.url);
      });
  }

};
