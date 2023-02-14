var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Fest = require('../models/Fest.model');
const fileUploader = require('../config/cloudinary.config');
const Comment = require('../models/Comment.model')

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Best Fest' });

  Fest.find()
  .populate('owner')
  .then((foundFests) => {
      res.render('index.hbs', { title: 'Best Fest', foundFests } );
  })
  .catch((err) => {
      console.log(err)
  })
});

module.exports = router;
