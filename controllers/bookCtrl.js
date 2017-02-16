const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const async = require('async');

exports.index = (req, res, next) => {
  async.parallel({
    book_count: (f) => Book.count(f),
    book_instance_count: (f) => BookInstance.count(f),
    book_instance_available_count: (f) => BookInstance.count({ status: 'Available' }, f),
    author_count: (f) => Author.count(f),
    genre_count: (f) => Genre.count(f),
  },

  (err, results) => {
    res.render('index', { title: 'Local Library Home', error: err, data: results })
  })
}

exports.books = (req, res, next) => {
  Book.find({}, 'title author ')
    .populate('author')
    .exec((err, books) => {
      if (err) { return next(err) }
      res.render('books', { title: 'Book List', books })
    })
}

exports.book_detail = (req, res, next) => {
  async.parallel({
    book: (f) => Book.findById(req.params.id).populate('author').populate('genre').exec(f),
    book_instance: (f) => BookInstance.find({ 'book': req.params.id }).exec(f)
  },

  (err, results) => {
    if (err) { return next(err) }
    res.render('book_detail', {
      title: 'Title',
      book:  results.book,
      book_instances: results.book_instance
    })
  })
}

exports.book_create_get = (req, res, next) => {
  async.parallel({
    authors: (f) => Author.find(f),
    genres: (f) => Genre.find(f)
  },
  (err, results) => {
      if (err) { return next(err) }
      res.render('book_form', { title: 'Create Book', authors:results.authors, genres:results.genres } )
  })
}

exports.book_create_post = (req, res, next) => {
  req.checkBody('title', 'Title must not be empty.').notEmpty();
  req.checkBody('author', 'Author must not be empty').notEmpty();
  req.checkBody('summary', 'Summary must not be empty').notEmpty();
  req.checkBody('isbn', 'ISBN must not be empty').notEmpty();

  req.sanitize('title').escape();
  req.sanitize('author').escape();
  req.sanitize('summary').escape();
  req.sanitize('isbn').escape();
  req.sanitize('title').trim();
  req.sanitize('author').trim();
  req.sanitize('summary').trim();
  req.sanitize('isbn').trim();
  req.sanitize('genre').escape();

  const errors = req.validationErrors()
  const book = new Book(
    { title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre.split(",")
     });

  console.log('BOOK: ' + book)

  if (errors) {
    async.parallel({
        authors: (f) => Author.find(f),
        genres: (f) => Genre.find(f),
    },
    (err, results) => {
      if (err) { return next(err); }
      for (i = 0; i < results.genres.length; i++) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
              //Current genre is selected. Set "checked" flag.
              results.genres[i].checked='true';
          }
      }
      res.render('book_form', {
        title: 'Create Book',
        authors:results.authors,
        genres:results.genres,
        book,
        errors,
      })
    })
  } else {
    book.save((err) => {
      if (err) { return next(err); }
      res.redirect(book.url);
    });
  }
}

exports.book_delete_get = (req, res, next) => {
  async.parallel({
    book: (f) => Book.findById(req.params.id).populate('author').populate('genre').exec(f),
    book_bookinstances: (f) => BookInstance.find({ 'book': req.params.id }).exec(f),
  },
  (err, results) => {
    if (err) { return next(err); }
      //Successful, so render
    res.render('book_delete', {
      title: 'Delete Book',
      book: results.book,
      book_instances: results.book_bookinstances,
    })
  })
}

exports.book_delete_post = (req, res, next) => {

    //Assume the post will have id (ie no checking or sanitisation).

  async.parallel({
      book: function(callback) {
          Book.findById(req.params.id).populate('author').populate('genre').exec(callback)
      },
      book_bookinstances: function(callback) {
          BookInstance.find({ 'book': req.params.id }).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      //Success
      if (results.book_bookinstances>0) {
          //Book has book_instances. Render in same way as for GET route.
          res.render('book_delete', { title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances } );
          return;
      } else {
        //Book has no bookinstances. Delete object and redirect to the list of books.
        Book.findByIdAndRemove(req.body.id, function deleteBook(err) {
            if (err) { return next(err); }
            //Success - got to books list
            res.redirect('/catalog/books')
        })
      }
  });

}

exports.book_update_get = (req, res, next) => {
  req.sanitize('id').escape()
  req.sanitize('id').trim()

  async.parallel({
    book: (f) => Book.findById(req.params.id).populate('author').populate('genre').exec(f),
    authors: (f) => Author.find(f),
    genres: (f) => Genre.find(f)
  },
  (err, results) => {
    if (err) { return next(err) }
    for (let g = 0; g < results.genres.length; g++) {
      for (let b = 0; b < results.book.genre.length; b++) {
        if (results.genres[g]._id.toString() == results.book.genre[b]._id.toString()) {
          results.genres[g].checked='true'
        }
      }
    }
    res.render('book_form', {
      title: 'Update Book',
      authors: results.authors,
      genres: results.genres,
      book: results.book
    })
  })
}

exports.book_update_post = (req, res, next) => {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  //Check other data
  req.checkBody('title', 'Title must not be empty.').notEmpty();
  req.checkBody('author', 'Author must not be empty').notEmpty();
  req.checkBody('summary', 'Summary must not be empty').notEmpty();
  req.checkBody('isbn', 'ISBN must not be empty').notEmpty();

  req.sanitize('title').escape();
  req.sanitize('author').escape();
  req.sanitize('summary').escape();
  req.sanitize('isbn').escape();
  req.sanitize('title').trim();
  req.sanitize('author').trim();
  req.sanitize('summary').trim();
  req.sanitize('isbn').trim();
  req.sanitize('genre').escape();

  const errors = req.validationErrors()
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre.split(","),
    _id: req.params.id
  })


  if (errors) {
      async.parallel({
          authors: function(callback) {
              Author.find(callback);
          },
          genres: function(callback) {
              Genre.find(callback);
          },
      }, function(err, results) {
          if (err) { return next(err); }

          // Mark our selected genres as checked
          for (i = 0; i < results.genres.length; i++) {
              if (book.genre.indexOf(results.genres[i]._id) > -1) {
                  results.genres[i].checked='true';
              }
          }
          res.render('book_form', { title: 'Update Book',authors:results.authors, genres:results.genres, book: book, errors: errors });
      });

  }
  else {
      // Data from form is valid. Update the record.
      Book.findByIdAndUpdate(req.params.id, book, {}, function (err, book) {
          if (err) { return next(err) }
             //successful - redirect to book detail page.
             res.redirect(book.url)
          });
  }
}
