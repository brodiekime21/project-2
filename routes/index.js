var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Fest = require('../models/Fest.model');
const fileUploader = require('../config/cloudinary.config');
const Comment = require('../models/Comment.model')


router.get('/', function(req, res, next) {
  Fest.find()
  .populate('owner')
  .then((foundFests) => {
    console.log(foundFests)
    foundFests.sort((a,b) => {
     return b.rating-a.rating
    })
    console.log(foundFests)
      res.render('index.hbs', { title: 'Best Fest', foundFests } );
  })
  .catch((err) => {
      console.log(err)
  })
});


module.exports = router;