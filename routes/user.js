var express = require("express");
var router = express.Router();
const userHelpers = require("../helpers/user-helpers");
const middleware = require("../middleware");
const {
   userSignUpValidationRules,
   validateSignup,
 } = require("../helpers/validator");

 
// GET: display the signup  
router.get('/signup',middleware.verifyNotLogin,(req,res)=>{
   var errorMsg = req.flash("error")[0];
   res.render('user/signup',{errorMsg,})

   res.render('user/signup',{"SignupErr":req.session.userSignupErr})
   req.session.userSignupErr=null
   
});

// POST: handle the signup logic
router.post(
   '/signup',
   [
      userSignUpValidationRules(),
      validateSignup,
   ],
   (req,res)=>{
       userHelpers.exists(req.body).then((response)=>{
         if(response.status){      
            req.session.userSignupErr="Email already in use "
            res.redirect('/user/signup')
         }else{
             
       userHelpers.doSignup(req.body).then((response)=>{
         console.log(">>>>>>>>>>>>>",response); 
         req.session.loggedIn = true
         req.session.user=response
         res.redirect('/')
   })
}
});
})


// GET: display the login form
router.get('/login',(req,res)=>{ 
// check if a user is logged in or not
   console.log('user>>>>>.',req.session.user);
   if (req.session.user){
      res.redirect('/')
   }else { 
      res.render('user/login',{"loginErr":req.session.userLoginErr, })
      req.session.userLoginErr=null
   
   }          
});
 
 
// POST: handle the signin logic
router.post(
   '/login',

(req,res)=>{
   userHelpers.doLogin(req.body).then((response)=>{   
         if(response.status){
            req.session.loggedIn=true,
            console.log('req.session.loggedIn>><<<',req.session.loggedIn)
            req.session.user=response.user       
            res.redirect('/')
         }else{
             req.session.userLoginErr="Invalid Email or password, try again!"
            res.redirect('/user/login')
         }
      }); 
   });  

   
// GET: logout
 router.get('/logout',middleware.verifyLogin,(req,res)=>{
   req.session.user=null 
   // req.session.user=false
req.session.loggedIn=false
   console.log('  req.session.user>>><<<',req.session.user)
   res.redirect('/')
})

module.exports = router;      

  