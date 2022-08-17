var express = require("express");
var router = express.Router();
var db=require('../config/connection')
var collection=require('../config/collections')

 
// GET: search box
router.get("/search",async(req, res,next)=> {
 
  var searchTerm = req.query.searchTerm; 
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.PRODUCT_COLLECTION).findOne(
      {$or:[ {Brand:new RegExp('^'+req.query.searchTerm+'.*' ,"i")}, {Name:{$regex: new RegExp('^'+req.query.searchTerm+'.*' ,"i")} }]})
      .then((product)=>{
      resolve(product)
      console.log('product>>>>',product)
      res.render('user/search',{product,searchTerm})
 
    });
    })
    }
)


module.exports = router;      
