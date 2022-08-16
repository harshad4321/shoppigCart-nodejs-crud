let middlewareObject = {};

//a middleware to check if a user is logged in or not


middlewareObject.verifyNotLogin=(req,res,next)=>{
    if (!req.session.loggedIn){
        console.log('req.session.loggedIn>>',req.session.loggedIn)
        return next();
    }else{ 
    res.redirect('/');
    } 
 }

middlewareObject.verifyLogin=(req,res,next)=>{
       console.log("req.session.user....>>>>>",req.session.loggedIn)
       if (req.session.loggedIn){
        next()
       }else{ 
       res.redirect('/user/login')  
       } 
    }





module.exports = middlewareObject;