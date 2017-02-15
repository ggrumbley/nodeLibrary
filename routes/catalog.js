const express = require('express');
const router = express.Router();

// Require controller modules
const books = require('../controllers/bookCtrl');
const authors = require('../controllers/authorCtrl');
const genres = require('../controllers/genreCtrl');
const book_instances = require('../controllers/bookinstanceCtrl');

/// BOOK ROUTES ///

/* GET catalog home page. */
router.get('/', books.index);

/* GET request for creating a Book. NOTE This must come before routes that display Book (uses id) */
router.get('/book/create', books.book_create_get);

/* POST request for creating Book. */
router.post('/book/create', books.book_create_post);

/* GET request to delete Book. */
router.get('/book/:id/delete', books.book_delete_get);

// POST request to delete Book
router.post('/book/:id/delete', books.book_delete_post);

/* GET request to update Book. */
router.get('/book/:id/update', books.book_update_get);

// POST request to update Book
router.post('/book/:id/update', books.book_update_post);

/* GET request for one Book. */
router.get('/book/:id', books.book_detail);

/* GET request for list of all Book items. */
router.get('/books', books.books);

/// AUTHOR ROUTES ///

/* GET request for creating Author. NOTE This must come before route for id (i.e. display author) */
router.get('/author/create', authors.author_create_get);

/* POST request for creating Author. */
router.post('/author/create', authors.author_create_post);

/* GET request to delete Author. */
router.get('/author/:id/delete', authors.author_delete_get);

// POST request to delete Author
router.post('/author/:id/delete', authors.author_delete_post);

/* GET request to update Author. */
router.get('/author/:id/update', authors.author_update_get);

// POST request to update Author
router.post('/author/:id/update', authors.author_update_post);

/* GET request for one Author. */
router.get('/author/:id', authors.author_detail);

/* GET request for list of all Authors. */
router.get('/authors', authors.authors);

/// GENRE ROUTES ///

/* GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id) */
router.get('/genre/create', genres.genre_create_get);

/* POST request for creating Genre. */
router.post('/genre/create', genres.genre_create_post);

/* GET request to delete Genre. */
router.get('/genre/:id/delete', genres.genre_delete_get);

// POST request to delete Genre
router.post('/genre/:id/delete', genres.genre_delete_post);

/* GET request to update Genre. */
router.get('/genre/:id/update', genres.genre_update_get);

// POST request to update Genre
router.post('/genre/:id/update', genres.genre_update_post);

/* GET request for one Genre. */
router.get('/genre/:id', genres.genre_detail);

/* GET request for list of all Genre. */
router.get('/genres', genres.genres);

/// BOOKINSTANCE ROUTES ///

/* GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id) */
router.get('/bookinstance/create', book_instances.bookinstance_create_get);

/* POST request for creating BookInstance. */
router.post('/bookinstance/create', book_instances.bookinstance_create_post);

/* GET request to delete BookInstance. */
router.get('/bookinstance/:id/delete', book_instances.bookinstance_delete_get);

// POST request to delete BookInstance
router.post('/bookinstance/:id/delete', book_instances.bookinstance_delete_post);

/* GET request to update BookInstance. */
router.get('/bookinstance/:id/update', book_instances.bookinstance_update_get);

// POST request to update BookInstance
router.post('/bookinstance/:id/update', book_instances.bookinstance_update_post);

/* GET request for one BookInstance. */
router.get('/bookinstance/:id', book_instances.bookinstance_detail);

/* GET request for list of all BookInstance. */
router.get('/bookinstances', book_instances.bookinstances);

module.exports = router;
