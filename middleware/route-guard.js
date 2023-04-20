// middleware/route-guard.js

const Fest = require("../models/Fest.model");
const Comment = require("../models/Comment.model");

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.render("users/login.hbs", {
      errorMessage: "You must be logged in to do that.",
    });
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/users/profile");
  }
  next();
};

const isOwner = (req, res, next) => {
  Fest.findById(req.params.id)
    .populate("owner")
    .then((foundFest) => {
      if (
        !req.session.user ||
        foundFest.owner._id.toString() !== req.session.user._id
      ) {
        res.redirect(`/fests/details/${req.params.id}`);
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const isCommentOwner = (req, res, next) => {
  Comment.findById(req.params.id)
    .populate("user")
    .then((foundComment) => {
      if (
        !req.session.user ||
        foundComment.user._id.toString() !== req.session.user._id
      ) {
        res.redirect(`/fests/details/${foundComment.festId}`);
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


module.exports = {
  isLoggedIn,
  isLoggedOut,
  isOwner,
  isCommentOwner,
};

// isNotOwner
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