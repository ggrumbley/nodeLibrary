const Author = require('../models/author')

exports.author_list = (req, res, next) => {
  res.send('Auther list')
}

exports.author_detail = (req, res, next) => {
  res.send(`Author detail ${req.params.id}`)
};

exports.author_create_get = (req, res, next) => {
  res.send('Auther create GET')
};

exports.author_create_post = (req, res, next) => {
  res.send('Auther create POST')
};

exports.author_delete_get = (req, res, next) => {
  res.send('Auther delete GET')
};

exports.author_delete_post = (req, res, next) => {
  res.send('Auther delete POST')
};

exports.author_update_get = (req, res, next) => {
  res.send('Auther update GET')
};

exports.author_update_post = (req, res, next) => {
  res.send('Auther update POST')
};
