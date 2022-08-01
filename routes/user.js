
const { request, response } = require("express");
var express = require("express");
const collections = require("../config/collections");
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers");
const verifyLogin=(req,res,next)=>{
   
   console.log("req.session.user....>>>>>",req.session.loggedIn)
   if (req.session.loggedIn){
    next()
   }else{ 
   res.redirect('/login')  
   } 
}

/* GET home page. */
router.get("/", async function (req, res, next) {
 let user = req.session.user
 console.log(user);
 let cartCount=null
 if(req.session.user){
  cartCount=await userHelpers.getCartCount(req.session.user._id)
 }
 productHelpers.getAllProducts().then((products)=>{ 
  res.render('user/view-product',{products,user,cartCount})   
   });
});
router.get('/login',(req,res)=>{ 
   console.log('user>>>>>.',req.session.loggedIn);
   if (req.session.loggedIn){
      res.redirect('/')
   }else { 

      res.render('user/login',{"loginErr":req.session.loginErr})
      req.session.loginErr =null
   }          

});


// GET: search box
router.get("/search", async (req, res) => {
   const perPage = 8;
   let page = parseInt(req.query.page) || 1;
   const successMsg = req.flash("success")[0];
   const errorMsg = req.flash("error")[0];
 
   try {
     const products = await products.find({
       title: { $regex: req.query.search, $options: "i" },
     })
       .sort("-createdAt")
       .skip(perPage * page - perPage)
       .limit(perPage)
       .populate("category")
       .exec();
     const count = await products.count({
       title: { $regex: req.query.search, $options: "i" },
     });
     res.render("", {
       pageName: "Search Results",
       products,
       successMsg,
       errorMsg,
       current: page,
       breadcrumbs: null,
       home: "/products/search?search=" + req.query.search + "&",
       pages: Math.ceil(count / perPage),
     });
   } catch (error) {
     console.log(error);
     res.redirect("/");
   }
 });
 




router.get('/signup',(req,res)=>{
   res.render('user/signup')
})
router.post('/signup',(req,res)=>{
    userHelpers.doSignup(req.body).then((response)=>{
      console.log(">>>>>>>>>>>>>",response); 

      req.session.loggedIn = true
      req.session.user=response
      res.redirect('/')
   
   })
});
router.post('/login',(req,res)=>{
   userHelpers.doLogin(req.body).then((response)=>{   
         if(response.status){
            req.session.loggedIn=true 
            req.session.user=response.user 
           
            res.redirect('/')
         }else{
             req.session.loginErr="Invalid username or password"
            res.redirect('/login')
         }
      }); 
   });  

 router.get('/logout',(req,res)=>{
   req.session.user=null 
   // req.session.user=false
   res.redirect('/')
})
router.get('/cart',verifyLogin,async(req,res)=>{
   let products =await userHelpers.getCartProducts(req.session.user._id)
   let totalValue=0 
   if(products.length>0){  

   totalValue=await userHelpers.getTotalAmount(req.session.user._id)

   let proId=req.params.id
   console.log(proId);
   
   }
 
   console.log(products); 
   let user=req.session.user._id;
   console.log("user...",user);
 res.render('user/cart',{products,user,totalValue});
  
})


router.get('/add-to-cart/:id',(req,res)=>{
//   console.log("api call.......")
userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
   res.json({status:true})
})
}) 
router.post('/change-product-quandity',(req,res,next)=>{
   console.log(req.body);

   userHelpers.changeproductQuandity(req.body).then(async(response)=>{
      response.total=await userHelpers.getTotalAmount(req.body.user)
    
      res.json(response)  

   })
}) 
 
router.get('/place-order',verifyLogin,async(req,res)=>{
   let  total=await userHelpers.getTotalAmount(req.session.user._id)
   res.render('user/place-order',{total,user:req.session.user})
  
})
//checking Payment 

router.post('/place-order',async(req,res)=>{
   let products=await userHelpers.getCartProductlist(req.body.userId)
   let totalPrice=await userHelpers.getTotalAmount(req.body.userId)
   userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
      console.log('orderid***>>>:',orderId);
      if(req.body['payment-method']==='COD'){
         res.json({codSuccess:true})
      }else {
userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
res.json(response)
})
      }

   })
   console.log(req.body);
  
})
router.get( '/order-success',(req,res)=>{ 
  res.render('user/order-success',{user:req.session.user}) 
//  console.log(_id) 
})
router.get('/orders',async(req,res)=>{ 
let orders=await userHelpers.getUserOrders(req.session.user._id) 

 res.render('user/orders',{user:req.session.user,orders})    
})
router.get('/view-order-products/:id',async(req,res)=>{  
   let products=await userHelpers.getOrderProducts(req.params.id)  
   console.log('0000000000000000000----->>>>>>>>>',req.params.id) 
    res.render('user/view-order-products',{user:req.session.user,products})   
}) 
router.post('/verify-payment',(req,res)=>{
console.log(req.body); 
userHelpers.verifyPayment(req.body).then(()=>{
   userHelpers.changePaymentStatus(req.body[  'order[receipt]']).then(()=>{
      console.log("Payment successs...") 
      res.json({status:true})
   }) 

}).catch((err)=>{ 
   console.log(err);
   res.json({status:false,errMsg:" "})  
})

})

router.post('/remove-product',(req,res)=>{
  userHelpers.removeProduct(req.body).then(async(response)=>{
      res.json(response)  

   })
}) 
 router.get('/over-view-product/:id',async(req,res)=>{ 
   try {
   let product=await productHelpers.getProductDetails(req.params.id)
   res.render('user/over-view-product',{product})
} catch (error) {
   res.status(500).send({message: error.message || "Error Occured" });
 }
 })

module.exports = router;      

  