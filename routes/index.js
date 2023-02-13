var express = require('express');
var router = express.Router();

const Fest = require('../models/Fest.model')

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
