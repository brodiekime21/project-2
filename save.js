router.get('/edit/:id', isOwner, (req, res, next) => {

    Fest.findById(req.params.id)
    .then((foundFest) => {
        res.render('fests/edit-fest.hbs', {foundFest:foundFest})
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/edit/:id', isOwner, fileUploader.single('imageUrl'), (req, res, next) => {
    const { name, review, rating, favSet } = req.body


    // console.log("This is the file", req.file)
    Fest.findById(req.params.id)
    .then((foundFest) => {

        if (req.file){
            console.log(req.file)
            
            const regex = /^(100|[1-9][0-9]?)$/;
            if (!regex.test(rating)) {
              res
                .status(500)
                .render('fests/edit-fest.hbs', { errorMessage: 'Rating must be between 0 and 100.', foundFest:foundFest });
        
                // .render('fests/edit-fest.hbs', { errorMessage: 'Rating must be between 0 and 100.' });
              return;
            }
            
            return Fest.findByIdAndUpdate(req.params.id, 
                {
                    name, 
                    review,
                    rating,
                    favSet,
                    imageUrl: req.file.path,
                },
                {new: true})
            .then((foundFest) => {
                // res.redirect(`/fests/details/${req.params.id}`)
            })
            .then((finalUpdate)=>{
                console.log("Final Update", finalUpdate)
                res.redirect(`/fests/details/${req.params.id}`)
            
                })
                .catch((err) => {
                    console.log(err)
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
            .then((foundFest) => {
                console.log("updated fest", foundFest)
                const regex = /^(100|[1-9][0-9]?)$/;
                if (!regex.test(rating)) {
                  res
                    .status(500)
                    .render('fests/edit-fest.hbs', { errorMessage: 'Rating must be between 0 and 100.', foundFest:foundFest });
            
                    // .render('fests/edit-fest.hbs', { errorMessage: 'Rating must be between 0 and 100.' });
                  return;
                }
                // res.redirect(`/fests/details/${req.params.id}`)
            })
            .then((finalUpdate)=>{
                console.log("Final Update", finalUpdate)
                res.redirect(`/fests/details/${req.params.id}`)
            
                })
                .catch((err) => {
                    console.log(err)
                })
            .catch((err) => {
                console.log(err)
            })   
        }
    
    })

    // .then((finalUpdate)=>{
    // console.log("Final Update", finalUpdate)
    // res.redirect(`/fests/details/${req.params.id}`)

    // })
    // .catch((err) => {
    //     console.log(err)
    // })
}) 