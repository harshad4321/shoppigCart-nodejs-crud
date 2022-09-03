let middlewareObject = {};
const userHelpers = require("../helpers/user-helpers");
//a middleware to check if a user is logged in or not


middlewareObject.verifyNotLogin=(req,res,next)=>{
    if (!req.session.loggedIn){
        console.log('req.session.loggedIn>>',req.session.loggedIn)
        return next();
    }else{ 
    res.redirect('/');
    } 
 }

middlewareObject.verifyLogin=async(req,res,next)=>{
       console.log("req.session.user....>>>>>",req.session.loggedIn)
       if (req.session.loggedIn){
        {
            cartCount = await userHelpers.getCartCount(req.session.user._id);
          }
        return next()
       }else{ 
       res.redirect('/user/login')  
       } 
    }


module.exports = middlewareObject;