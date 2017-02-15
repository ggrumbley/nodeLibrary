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
