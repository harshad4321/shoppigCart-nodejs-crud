var express = require("express");
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();
 

// router.get('/search/:Name', (req,res) => {
// })
//    router.post('user/search',(req,res,next)=>{
//     let user = req.session.user
//     var regex = new RegExp(req.params.Name,'i'),
//    productHelpers.getAllProducts({Name:regex}).then((result)=>{
//     console.log('result',result)
//         res.render('user/search',{result,user});
//     })
// })


router.get("/search/:key",(req, res)=> {
  var searchTerm = req.body.searchTerm
  // console.log('regex',regex)
    productHelpers.getAllProducts(
      {'Name':regex}).then((result)=>{
      console.log('result>>>>>>>',result)
      res.render('user/search', {result});
      
    })
  })

// GET: search box

// router.post("/search",async (req, res)=> {
//  let searchTerm = req.body.searchTerm;
//  console.log('regex ><<<<<',searchTerm)
    
//   searchResults =  await productHelpers.getAllProducts({$or:[{class: searchTerm}, {brand:searchTerm}, {Name: searchTerm}]}, (err, products) => {
//         if(err) console.log(err);
//         else{
//             res.locals.site.pageTitle = 'Search for ' + searchTerm;
//             res.render('user/search',{searchResults: products})
//             console.log('searchResults',searchResults)
//         }

//     });

// })


module.exports = router;      

// try {
//   let user = req.session.user
//   // let searchTerm = req.body.searchTerm;
//   const searchTerm = req.body.searchTerm;
//   let  product=  await userHelpers.getAllSearchProducts({Name:{ $regex:'.*'+searchTerm+'.*'} })
//   res.render('user/search',{product,user});
//         console.log('regex ><<<<<',searchTerm)
//         console.log('product><<<<<',product)
// } catch (error) {
//         res.status(500).send({message: error.message || "Error Occured" });
//         res.redirect("/"); 
//       } 