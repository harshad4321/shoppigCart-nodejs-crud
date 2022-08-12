var express = require("express");
var router = express.Router();
const userHelpers = require("../helpers/user-helpers");
const middleware = require("../middleware");
const {
   userSignUpValidationRules,
   userSignInValidationRules,
   validateSignup,
   validateSignin,
 } = require("../helpers/validator");

 


// const verifyLogin=(req,res,next)=>{
//    console.log("req.session.user....>>>>>",req.session.loggedIn)
//    if (req.session.loggedIn){
//     next()
//    }else{ 
//    res.redirect('/login')  
//    } 
// }
// ...............................
/* GET home page. */

// router.get("/", async function (req, res, next) {
//  let user = req.session.user
//  console.log('>>>>>user>>',user);
//  let cartCount=null
//  if(req.session.user){
//   cartCount=await userHelpers.getCartCount(req.session.user._id)
//  }
//  productHelpers.getAllProducts().then((products)=>{
//   res.render('user/view-product',{products,user,cartCount})   
//    });
// });



// GET: display the signup  
router.get('/signup',middleware.isNotLoggedIn,(req,res)=>{
   var errorMsg = req.flash("error")[0];
   res.render('user/signup',{errorMsg,})
});

// POST: handle the signup logic
router.post(
   '/signup',
   [
      middleware.isNotLoggedIn,
      userSignUpValidationRules(),
      validateSignup,
   ],
   (req,res)=>{
    userHelpers.doSignup(req.body).then((response)=>{
      console.log(">>>>>>>>>>>>>",response); 
      req.session.loggedIn = true
      req.session.user=response
      res.redirect('/')
   
   })
});


// GET: display the login form
router.get('/login',middleware.isNotLoggedIn,(req,res)=>{ 
// check if a user is logged in or not
   console.log('user>>>>>.',req.session.user);
   if (req.session.user){
      res.redirect('/')
   }else { 
      res.render('user/login',{"loginErr":req.session.loginErr})
      req.session.loginErr=null
   
   }          
});
 
 


// POST: handle the signin logic
router.post('/login', middleware.isNotLoggedIn,(req,res)=>{
   userHelpers.doLogin(req.body).then((response)=>{   
         if(response.status){
            req.session.loggedIn=true,
            console.log('req.session.loggedIn>><<<',req.session.loggedIn)
            req.session.user=response.user       
            res.redirect('/')
         }else{
             req.session.loginErr="Invalid username or password"
            res.redirect('/login')
         }
      }); 
   });  

   
// GET: logout
 router.get('/logout',middleware.isLoggedIn,(req,res)=>{
   req.session.user=null 
   // req.session.user=false
req.session.loggedIn=false
   console.log('  req.session.user>>><<<',req.session.user)
   res.redirect('/')
})

// router.get('/cart',verifyLogin,async(req,res)=>{
//     let products =await userHelpers.getCartProducts(req.session.user._id)
//    let totalValue=0 
//    if(products.length>0){   

//    totalValue=await userHelpers.getTotalAmount(req.session.user._id)
//    let proId=req.params.id
//    console.log(proId);
//    }
//    console.log(products); 
//    let user=req.session.user._id;
    
//    console.log("user...",user);
//  res.render('user/cart',{products,user,totalValue,user});
  
// })


// router.get('/add-to-cart/:id',(req,res)=>{
// //   console.log("api call.......")
// userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
//    res.json({status:true})
// })
// }) 
// router.post('/change-product-quandity',(req,res,next)=>{
//    console.log(req.body);

//    userHelpers.changeproductQuandity(req.body).then(async(response)=>{
//       response.total=await userHelpers.getTotalAmount(req.body.user)
    
//       res.json(response)  

//    })
// }) 
 
// router.get('/place-order',verifyLogin,async(req,res)=>{
//    let  total=await userHelpers.getTotalAmount(req.session.user._id)
//    res.render('user/place-order',{total,user:req.session.user})
  
// })
// //checking Payment 

// router.post('/place-order',async(req,res)=>{
//    let products=await userHelpers.getCartProductlist(req.body.userId)
//    let totalPrice=await userHelpers.getTotalAmount(req.body.userId)
//    userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
//       console.log('orderid***>>>:',orderId);
//       if(req.body['payment-method']==='COD'){
//          res.json({codSuccess:true})
//       }else {
// userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
// res.json(response)
// })
//       }

//    })
//    console.log(req.body);
  
// })
// router.get( '/order-success',(req,res)=>{ 
//   res.render('user/order-success',{user:req.session.user}) 
// //  console.log(_id) 
// })
// router.get('/orders',async(req,res)=>{ 
// let orders=await userHelpers.getUserOrders(req.session.user._id) 

//  res.render('user/orders',{user:req.session.user,orders})    
// })
// router.get('/view-order-products/:id',async(req,res)=>{  
//    let products=await userHelpers.getOrderProducts(req.params.id)  
//    console.log('0000000000000000000----->>>>>>>>>',req.params.id) 
//     res.render('user/view-order-products',{user:req.session.user,products})   
// }) 
// router.post('/verify-payment',(req,res)=>{
// console.log(req.body); 
// userHelpers.verifyPayment(req.body).then(()=>{
//    userHelpers.changePaymentStatus(req.body[  'order[receipt]']).then(()=>{
//       console.log("Payment successs...") 
//       res.json({status:true})
//    }) 

// }).catch((err)=>{ 
//    console.log(err);
//    res.json({status:false,errMsg:" "})  
// })

// })

// router.post('/remove-product',(req,res)=>{
//   userHelpers.removeProduct(req.body).then(async(response)=>{
//       res.json(response)  

//    })
// }) 
//  router.get('/over-view-product/:id',async(req,res)=>{ 
//    try {
//       let user = req.session.user
//       let cartCount=null
//  if(req.session.user){
//   cartCount=await userHelpers.getCartCount(req.session.user._id)
//  }
//    let product=await productHelpers.getProductDetails(req.params.id)
//    res.render('user/over-view-product',{product,user,cartCount})
// } catch (error) {
//    res.status(500).send({message: error.message || "Error Occured" });
//  }
//  }) 
 
// // GET: search box

// router.post("/search",async (req, res)=> {
//    try {
//    let user = req.session.user
//    // let searchTerm = req.body.searchTerm;
//    const searchTerm = req.body.searchTerm;
//    let  product=  await productHelpers.getAllProducts({Name:{ $regex:'.*'+searchTerm+'.*'} })
//    res.render('user/search',{product,user});
//          console.log('regex ><<<<<',searchTerm)
//          console.log('product><<<<<',product)
// } catch (error) {
//          res.status(500).send({message: error.message || "Error Occured" });
//          res.redirect("/"); 
//        } 

// })

module.exports = router;      

  