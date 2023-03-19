const express = require('express');
var router = express.Router();
const middleware = require("../middleware");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
const { render } = require('../app');



//get

router.get('/reviews/:id?', middleware.verifyLogin, (req, res, next) => {
   userHelpers.doLogin(req.body).then(async (response) => {
      let product = await productHelpers.getProductDetails(req.params.id)
      if (req.session.user) {
         req.session.loggedIn = true,
            user = req.session.user;
         res.render('user/reviews', { product, user })
      }
   })
})



//post 

router.post('/reviews/:id?', middleware.verifyLogin, (req, res, next) => {
   productHelpers.addProductsReview(req.body, (id) => {
      result = req.body
      // var message = 'This is a message from the  endpoint'
      res.redirect('/');

   })
})



//edit


router.get('/update-review/:id', middleware.verifyLogin, async (req, res) => {
   if (req.session.user) {
      req.session.loggedIn = true,
         user = req.session.user;
      let review = await productHelpers.getProductsReview(req.params.id)
      let userId = review.userId
      let presentUserId = user._id
      if (presentUserId == userId) {
         res.render('user/update-review', { review, user })
      } else {
         console.log(' you cant access.. ');
         res.redirect('/', {

         })
      }
   }
})

router.post("/update-review/:id", middleware.verifyLogin, (req, res) => {
   let reviews = req.body
   let userId = reviews.userId
   let user = req.session.user;
   let presentUserId = user._id
   if (presentUserId == userId) {
      try {
         productHelpers.editProductsReview(req.params.id, req.body).then(() => {
            res.redirect("/",
            )
         })
      } catch (error) {
         res.redirect("/");
      }
   } else {
      console.log('ppppppppppppp');
      // req.flash('message', 'You cant access...')
      res.redirect('/')
   }
});





router.get('/delete-review/:id?', middleware.verifyLogin, (req, res) => {
   userHelpers.doLogin(req.body).then((response) => {
      if (req.session.user) {
         req.session.loggedIn = true,
            user = req.session.user;
         let proId = req.params.id
         productHelpers.deletereview(proId).then((response) => {
            res.redirect('/')
         })
      }
   })
})


module.exports = router;