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
  res.render('genre_form', { title: 'Create Genre' })
}

exports.genre_create_post = (req, res, next) => {
  req.checkBody('name', 'Genre name required').notEmpty()
  req.sanitize('name').escape()
  req.sanitize('name').trim()

  const errors = req.validationErrors()
  const genre = new Genre({ name: req.body.name })

  if (errors) {
    res.render('genre_form', { title: 'Create Genre', genre, errors })
    return
  } else {
    Genre.findOne({ 'name': req.body.name })
      .exec((err, found_genre) => {
        console.log(`found_genre: ${found_genre}`)
        if (err) { return next(err) }
        if (found_genre) {
          res.redirect(found_genre.url)
        } else {
          genre.save((err) => {
            if (err) { return next(err) }
            res.redirect(genre.url)
          })
        }
      })
  }
}


// Display Genre delete form on GET
exports.genre_delete_get = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback)
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
    });

};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res, next) {

    req.checkBody('id', 'Genre id must exist').notEmpty();

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback)
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.genre_books>0) {
            //Genre has books. Render in same way as for GET route.
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
            return;
        }
        else {
            //Genre has no books. Delete object and redirect to the list of genres.
            Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                if (err) { return next(err); }
                //Success - got to genres list
                res.redirect('/catalog/genres')
            })

        }
    });

};

// Display Genre update form on GET
exports.genre_update_get = function(req, res, next) {

    req.sanitize('id').escape();
    req.sanitize('id').trim();
    Genre.findById(req.params.id, function(err, genre) {
        if (err) { return next(err); }
        //On success
        res.render('genre_form', { title: 'Update Genre', genre: genre });
    });

};

// Handle Genre update on POST
exports.genre_update_post = function(req, res, next) {

    req.sanitize('id').escape();
    req.sanitize('id').trim();
    //Check that the name field is not empty
    req.checkBody('name', 'Genre name required').notEmpty();
    //Trim and escape the name field.
    req.sanitize('name').escape();
    req.sanitize('name').trim();

    //Run the validators
    var errors = req.validationErrors();

    //Create a genre object with escaped and trimmed data (and the old id!)
    var genre = new Genre(
      {
      name: req.body.name,
      _id: req.params.id
      }
    );

    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors});
    return;
    }
    else {
        // Data from form is valid. Update the record.
        Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,thegenre) {
            if (err) { return next(err); }
               //successful - redirect to genre detail page.
               res.redirect(thegenre.url);
            });
    }

};
