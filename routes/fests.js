var express = require('express');
var router = express.Router();

const { isLoggedIn, isOwner, isNotOwner } = require('../middleware/route-guard')

const Fest = require('../models/Fest.model')
const fileUploader = require('../config/cloudinary.config')


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

router.get('/create-fest', isLoggedIn, (req, res, next) => {
  res.render('fests/create-fest.hbs');
});



router.post('/create-fest', isLoggedIn ,fileUploader.single('imageUrl'), (req, res, next) => {

    const { name, review, rating, favSet } = req.body

    Fest.create({
        name,
        review,
        rating,
        favSet,
        imageUrl: req.file.path,
        owner: req.session.user._id
    })
    .then((createdFest) => {
        console.log(createdFest)
        res.redirect('/fests/all-fests')
    })
    .catch((err) => {
        const message = err.errors.rating.properties.message
        console.log(err.errors.rating.properties.message)
        res.render('fests/create-fest.hbs',{errorMessage: message});
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

router.get('/edit/:id', isOwner, (req, res, next) => {

    Fest.findById(req.params.id)
    .then((foundFest) => {
        res.render('fests/edit-fest.hbs', foundFest)
    })
    .catch((err) => {
        console.log(err)
    })
})



router.post('/edit/:id', isOwner, fileUploader.single('imageUrl'), (req, res, next) => {
    const { name, review, rating, favSet } = req.body

    const regex = /^(100|[1-9][0-9]?)$/;
    if (!regex.test(rating)) {
      res
        .status(500)
        .redirect(`/fests/edit/${req.params.id}`)

        // .render('fests/edit-fest.hbs', { errorMessage: 'Rating must be between 0 and 100.' });
      return;
    }
    // console.log("This is the file", req.file)
    Fest.findById(req.params.id)
    .then((foundFest) => {

        if (req.file){
            console.log(req.file)
            
            return Fest.findByIdAndUpdate(req.params.id, 
                {
                    name, 
                    review,
                    rating,
                    favSet,
                    imageUrl: req.file.path,
                },
                {new: true})
            .then((updatedFest) => {
                console.log(updatedFest)
                // res.redirect(`/fests/details/${req.params.id}`)
            })
            .catch((err) => {
                console.log(err)
            })
        }
        else {
            return Fest.findByIdAndUpdate(req.params.id, 
                {
                    name, 
                    review,
                    rating,
                    favSet,
                },
                {new: true})
            .then((updatedFest) => {
                console.log(updatedFest)
                // res.redirect(`/fests/details/${req.params.id}`)
            })
            .catch((err) => {
                console.log(err)
            })   
        }
    
    })
    .then((finalUpdate)=>{
    console.log("Final Update", finalUpdate)
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

router.post('/add-comment/:id', isLoggedIn, (req, res, next) => {

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