let middlewareObject = {};

//a middleware to check if a user is logged in or not


middlewareObject.isNotLoggedIn=(req,res,next)=>{
    if (!req.session.loggedIn){
        return next();
    }else{ 
    res.redirect('/')  
    } 
 }


middlewareObject.isLoggedIn=(req,res,next)=>{
    if (req.session.loggedIn){
        return next();
    }else{ 
    res.redirect('/login')  
    } 
 }


module.exports = middlewareObject;