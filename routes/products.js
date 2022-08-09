const express = require("express");
const router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers");





// GET: display all products
// router.get("/", async (req, res) => {
//     const successMsg = req.flash("success")[0];
//     const errorMsg = req.flash("error")[0];
//     const perPage = 8;
//     let page = parseInt(req.query.page) || 1;
//     try {
//         productHelpers.getAllProducts().then((products)=>{
//             res.render('user/view-product',{products,user,cartCount})   
//              });
  
//     } catch (error) {
//       console.log(error);
//       res.redirect("/");
//     }
//   });
 

// router.get("/", async  (req, res, next)=> {
//     let user = req.session.user
//     console.log('>>>>>user>>',user);
//     let cartCount=null
//     if(req.session.user){
//      cartCount=await userHelpers.getCartCount(req.session.user._id)
//     }
//     productHelpers.getAllProducts().then((products)=>{
//      res.render('user/Allproduct',{
//         products,
//         user,
//         cartCount,
//     })   
//       });
//    });