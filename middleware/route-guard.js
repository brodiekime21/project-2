// middleware/route-guard.js

const Fest = require('../models/Fest.model')

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/users/login');
    }
    next();
};
  
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
const isLoggedOut = (req, res, next) => {
if (req.session.user) {
    return res.redirect('/users/profile');
}
next();
};

const isOwner = (req, res, next) => {

    Fest.findById(req.params.id)
    .populate('owner')
    .then((foundFest) => {
        if (!req.session.user || foundFest.owner._id.toString() !== req.session.user._id) {
            res.redirect(`/fests/details/${req.params.id}`)
        } else {
            next()
        }
    })
    .catch((err) => {
        console.log(err)
    })
}

// const isNotOwner = (req, res, next) => {

//     Fest.findById(req.params.id)
//     .populate('owner')
//     .then((foundFest) => {
//         if (!req.session.user || foundFest.owner._id.toString() === req.session.user._id) {
//             res.render('index.hbs', {errorMessage: "You can't comment your own fest."})
//         } else {
//             next()
//         }
//     })
//     .catch((err) => {
//         console.log(err)
//     })

// }

module.exports = {
isLoggedIn,
isLoggedOut,
isOwner,
// isNotOwner
};