
const { request } = require("express");
var express = require("express");
// const collections = require("../config/collections");
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers");
const multer = require('multer')


/* GET home page. */
router.get("/", function (req, res, next) {
//  let user = req.session.user
//  console.log(user)
 productHelpers.getAllProducts().then((products)=>{
     
  res.render('user/view-product',{products})   
   });
});
router.get('/login',(req,res)=>{            
  res.render('user/login')
});

router.get('/signup',(req,res)=>{
   res.render('user/signup')
})
router.post('/signup',(req,res)=>{
    userHelpers.doSignup(req.body).then((response)=>{
      console.log(req.body);   
      // req.session.loggedIn = true
      // req.session.user=response
      // res.redirect('/')
   })
});
router.post('/login',(req,res)=>{
   userHelpers.doLogin(req.body)
}); 
   //   console.log(req.body) //.then((response)=>{   
      //    console.log(response);
      //   console.log(req.body);
      //    if(response.status){
      //       req.session.loggedIn=true 
      //       req.session.user=response.user 
      //       res.redirect('/')
      //    }else{
      //       //  req.session.loginErr="Invalid username or password"
      //       res.redirect('/login')
      //    }
      // });


// router.get('/logout',(req,res)=>{
//    req.session.destroy()
//    res.redirect('/')
// })
// router.get('/cart',verifyLogin,async(req,res)=>{
//    let products =await userHelpers.getCartProducts(req.session.user._id)
//    console.log(products);
//  res.render('user/cart')
// })


router.get('/cart',(req,res)=>{
   res.render(`user/cart`)
})
router.get('/add-to-cart/:id',(req,res)=>{
userHelpers.addToCart(req.params.id,req.seccion.user._id).then(()=>{
   res.redirect('product')
})
})

module.exports = router;

// userHelpers.doLogin(req.body).then((response)=>{   
   //    console.log(response);
   //   console.log(req.body);
   //    if(response.status){
   //       req.session.loggedIn=true 
   //       req.session.user=response.user  
   //       res.redirect('/')
   //    }else{
   //       //  req.session.loginErr="Invalid username or password"
   //       res.redirect('/login')
   //    } 
   // })