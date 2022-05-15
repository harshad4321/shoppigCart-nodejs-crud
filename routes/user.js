

const { response } = require("express");
var express = require("express");
const { default: mongoose } = require("mongoose");
const collections = require("../config/collections");
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const { doSignup } = require("../helpers/user-helpers");
const userHelpers = require("../helpers/user-helpers");
//  const userHelpers=require('../helpers/user-helpers')
 const admin = require('../helpers/user-helpers')

 const user = require('../helpers/user-helpers')

/* GET home page. */
router.get("/", function (req, res, next) {
//   let user = req.session.user
 productHelpers.getAllProducts().then((products)=>{
      
  res.render('user/view-product',{products})   
   });
 
});
router.get('/login',(req,res)=>{
   // if(req.session.loggedIn){ 
   //    res.redirect('/')
   // } else
      res.render('user/login')// {'loginErr':req.session.loginErr})
      // req.session.loginErr=false
   
 
})
router.get('/signup',(req,res)=>{
   res.render('user/signup')
})



// router.post('/signup',(req,res)=>{
     
//   req.body.email
//   req.body.password


router.post('/signup',async(req,res)=>{

    userHelpers.doSignup(req.body).then((response)=>{
      console.log(response);
      console.log(req.body);
      
   })

  
});

  
 
  


router.post('/login',(req,res)=>{
   userHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
         req.session.loggedIn=true 
         req.session.user=response.user 
         res.redirect('/')
      }else{
         // req.session.loginErr="Invalid username or password"
         res.redirect('/login')
      } 
   })
  
})

router.get('/logout',(req,res)=>{
   // req.session.destroy()
   // res.redirect('/')
})

module.exports = router;
