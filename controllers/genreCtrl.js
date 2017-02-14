const Genre = require('../models/genre');

exports.genre_list = (req, res, next) => {
  res.send('Genre list')
}

exports.genre_detail = (req, res, next) => {
  res.send(`Genre detail ${req.params.id}`)
}

exports.genre_create_get = (req, res, next) => {
  res.send('Genre create GET')
}

exports.genre_create_post = (req, res, next) => {
  res.send('Genre create POST')
}

exports.genre_delete_get = (req, res, next) => {
  res.send('Genre delete GET')
}

exports.genre_delete_post = (req, res, next) => {
  res.send('Genre delete POST')
}

exports.genre_update_get = (req, res, next) => {
  res.send('Genre update GET')
}

exports.genre_update_post = (req, res, next) => {
  res.send('Genre update POST')
}
