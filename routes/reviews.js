const express= require('express');
var router = express.Router();
const middleware    = require("../middleware");
const productHelpers = require("../helpers/product-helpers");
const userHelpers   = require("../helpers/user-helpers");
const { render } = require('../app');

//get

router.get ('/reviews/:id?',middleware.verifyLogin,(req ,res ,next)=>{
       
 userHelpers.doLogin(req.body).then(async (response)=>{ 
       

let product=await productHelpers.getProductDetails(req.params.id)

console.log('>>>>>/>>>>>>>>>product>>>>>>>>>>>>>>>>>>>>>id',product._id);

     if(req.session.user){
            req.session.loggedIn=true,
            console.log('req.session.loggedIn>><<<',req.session.user)
               user=req.session.user;
        res.render('user/reviews',{product,user})
     }
 })
})



//post

router.post('/reviews/:id?',middleware.verifyLogin,(req,res,next)=>{
     productHelpers.editProductsReview(req.body, (id) => {
     
     console.log('?????????????????????',req.body);
     result=req.body 
              res.redirect("/over-view-product/:id");
            
            })
     })



//edit

// router.post("/reviews/:id?",middleware.verifyLogin,(req, res) => {
   
//    try{
//      productHelpers.editProductsReview(req.params.id,req.body).then(() => {
//        res.redirect("/");
//      })
//    }catch (error) {
//       res.redirect("/");
    
//    }
//  });
 



 
router.get('/delete-review/:id',middleware.verifyLogin,(req,res)=>{ 

userHelpers.doLogin(req.body).then((response)=>{   
     if(req.session.user){
            req.session.loggedIn=true,
            console.log('req.session.loggedIn>><<<',req.session.user)
               user=req.session.user;


  let proId=req.params.id
   console.log(proId);
   productHelpers.deletereview(proId).then((response )=>{
     res.redirect('/')
   })
   }
   })
})


module.exports = router;