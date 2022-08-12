var express = require("express");
const middleware = require("../middleware");
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
const userHelpers = require("../helpers/user-helpers");





/* GET home page. */
router.get("/", async  (req, res, next)=> {
    let user = req.session.user
    console.log('>>>>>user>>',user);
    let cartCount=null
    if(req.session.user){
     cartCount=await userHelpers.getCartCount(req.session.user._id)
    }
    productHelpers.getAllProducts().then((products)=>{
     res.render('user/view-product',{  products,user,cartCount})   
      });
   });
   
   
   

   module.exports=router;
   
   
   