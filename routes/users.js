var express = require('express');
var router = express.Router();

const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
const Fest = require('../models/Fest.model');
const fileUploader = require('../config/cloudinary.config');
const Comment = require('../models/Comment.model')


const { isLoggedIn, isLoggedOut, isOwner } = require('../middleware/route-guard');

/* GET users listing. */
router.get('/signup', isLoggedOut, (req, res, next) => {
  res.render('users/signup.hbs')
});

router.post('/signup', isLoggedOut, (req, res, next) => {

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render('users/signup.hbs', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('users/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt)
    })
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        password: hashedPassword
      });
    })
    .then((userFromDB) => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/users/login')
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('users/signup.hbs', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('users/signup.hbs', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    })

})

router.get('/login', isLoggedOut, (req, res, next) => {
  res.render('users/login.hbs')
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  Fest.find()
  
  .populate('owner')
  .then((foundFests) => {
    // console.log(req.session.user._id)
    let profileFests=[];
    for (let i=0;i<foundFests.length;i++){
    // console.log(String(foundFests[i].owner._id))      
    if (String(foundFests[i].owner._id) === req.session.user._id){
      profileFests.push(foundFests[i])
    }
    }
    console.log(profileFests[0].owner.username)
      res.render('users/profile.hbs', { profileFests } );
  })
  .catch((err) => {
      console.log(err)
  })
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    res.render('users/login.hbs', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
 
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('users/login.hbs', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.user = user
        res.redirect('/users/profile');
      } else {
        res.render('users/login.hbs', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});



router.get('/edit-profile', isLoggedIn, (req, res, next) => { //took out middleware
  
  User.findById(req.session.user._id)
  .then((foundUser) => {
    console.log(foundUser)
    res.render('users/edit-profile.hbs', foundUser)
  })
  .catch((err) => {
    console.log(err)
  })
})


router.post('/edit-profile/:id', fileUploader.single('imageUrl'), (req, res, next) => { //took out middleware
  const { username, bio, profileImageUrl } = req.body
  console.log("This is the file", req.file)
  User.findById(req.params.id)
  .then((foundUser) => {
    
    if (req.file){
      // console.log(req.file)
      
      return User.findByIdAndUpdate(req.params.id, 
        {
          username, 
          bio,
          profileImageUrl: req.file.path,
        },
        {new: true})
        .then((updatedUser) => {
          // console.log(updatedUser)
          // res.redirect(`/fests/details/${req.params.id}`)
        })
        .catch((err) => {
          console.log(err)
        })
      }
      else {
        return User.findByIdAndUpdate(req.params.id, 
          {
            username, 
            bio,
          },
          {new: true})
          .then((updatedUser) => {
            // console.log(updatedUser)
            // res.redirect(`/fests/details/${req.params.id}`)
          })
          .catch((err) => {
            console.log(err)
          })   
        }
        
      })
      .then((finalUpdate)=>{
        // console.log("Final Update", finalUpdate)
        res.redirect(`/users/profile`)
        
      })
      .catch((err) => {
        console.log(err)
      })
    }) 
    
    
    router.get('/logout', (req, res, next) => {
      req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/users/login');
      });
    });
    
    module.exports = router;
    