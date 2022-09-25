const { response } = require("express");
var express = require("express");
const productHelpers = require("../helpers/product-helpers");
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers')

const verifyLogin = (req, res, next) => {
  if (req.session.adminLogin) {
    next();
  } else {
    res.render('admin/admin-login', { adminErr: req.session.adminLoginErr})
    req.session.adminLoginErr = false;
  }
}



router.post('/admin-login', (req,res) => {
  try{
    adminHelpers.doAdminLogin(req.body).then((response) => {
      if (response.status) {
        req.session.adminLogin = true;
        req.session.admin = response.admin;
        res.redirect('/admin')
      } else {
        req.session.adminLoginErr = "Incorrect username or password ";
        res.redirect('/admin')
      }
    })
  }catch (error) {
    console.log(error);
  }
})

router.get('/logout', (req, res) => {
  try{
    req.session.admin = null;
    req.session.adminLogin = null;
    // req.session.destroy();
    res.redirect('/admin')
  }catch (error) {
    console.log(error);
  }
})




/* GET users listing. */
router.get("/", verifyLogin, (req, res, next)=> {
  productHelpers.getAllProducts().then((products) => {
    console.log(products);
    res.render("admin/view-products", { admin: true, products });
  });
});
router.get("/add-product", verifyLogin,(req, res)=> {
  res.render("admin/add-product");
});

router.post("/add-product", (req, res, next) => {
  productHelpers.addProduct(req.body, (id) => {

    let image=req.files.Image ;
    const imageName = id.jpg ;
    console.log(id);
    image.mv('./public/product-images/'+id+'.jpg',(err)=> {
      if (!err) { 
        res.render("admin/add-product"); 
        res.redirect('/admin')
      } else {
        console.log(err); 
      }  
    });  
  });        
});    

router.get('/delete-product/:id',(req,res)=>{ 
  let proId=req.params.id
   console.log(proId);
   productHelpers.deleteProduct(proId).then((response )=>{
     res.redirect('/admin/')
   })
})
router.get('/edit-product/:id',async(req,res)=>{ 
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
}) 
router.post('/edit-product/:id',(req,res)=>{ 
  let id=req.params.id  // image id 
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if (req.files && req.files.Image){ 
      const imageName = id.jpg ; 
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    }
    else{
      console.log(' image is not')
    }
  })
})


module.exports = router;
