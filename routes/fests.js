var express = require('express');
var router = express.Router();

const { isLoggedIn, isOwner, isNotOwner } = require('../middleware/route-guard')

const Fest = require('../models/Fest.model')

const Comment = require('../models/Comment.model')

router.get('/all-fests', (req, res, next) => {

    Fest.find()
    .populate('owner')
    .then((foundFests) => {
        res.render('fests/all-fests.hbs', { foundFests });
    })
    .catch((err) => {
        console.log(err)
    })

});

router.get('/create-fest', (req, res, next) => {   /////I TOOK OUT MIDDLEWARE
  res.render('fests/create-fest.hbs');
});

router.post('/create-fest', (req, res, next) => {

    const { name, description, imageUrl } = req.body

    Fest.create({
        name,
        description,
        imageUrl,
        owner: req.session.user._id
    })
    .then((createdFest) => {
        console.log(createdFest)
        res.redirect('/festss/all-fests')
    })
    .catch((err) => {
        console.log(err)
    })

})

router.get('/details/:id', (req, res, next) => {
    
    Fest.findById(req.params.id)
    .populate('owner')
    .populate({
        path: "comments",
        populate: {path: "user"}
    })
    .then((foundFest) => {
        res.render('fests/fest-details.hbs', foundFest)
    })
    .catch((err) => {
        console.log(err)
    })

})

router.get('/edit/:id', (req, res, next) => {

    Fest.findById(req.params.id)
    .then((foundFest) => {
        res.render('fests/edit-fest.hbs', foundFest)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/edit/:id', (req, res, next) => {
    const { name, description, imageUrl } = req.body
    Fest.findByIdAndUpdate(req.params.id, 
        {
            name, 
            description,
            imageUrl
        },
        {new: true})
    .then((updatedFest) => {
        console.log(updatedFest)
        res.redirect(`/fests/details/${req.params.id}`)
    })
    .catch((err) => {
        console.log(err)
    })
}) 

router.get('/delete/:id', isOwner, (req, res, next) => {
    Fest.findByIdAndDelete(req.params.id)
    .then((confirmation) => {
        console.log(confirmation)
        res.redirect('/fests/all-fests')
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/add-comment/:id', (req, res, next) => {

    Comment.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newComment) => {
       return Fest.findByIdAndUpdate(req.params.id, 
            {
                $push: {comments: newComment._id}
            },
            {new: true})
    })
    .then((festWithComment) => {
        console.log(festWithComment)
        res.redirect(`/fests/details/${req.params.id}`)
    })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router;