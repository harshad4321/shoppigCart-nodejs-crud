 

 var db=require('../config/connection')
 var collection=require('../config/collections')
 const bcrypt=require('bcrypt');
const { response } = require('express');
var objectId=require('mongodb').ObjectId
 

module.exports={
    doSignup:(userData)=>{
        return new Promise (async(resolve,reject)=>{
      
        userData.password=await bcrypt.hash(userData.password,10)
               
                  db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                    resolve(data) 
                    // console.log(userData.password)
                    // console.log(userData.email)                    
                });
                });
             
     },
        
     doLogin:(userData)=>{
        return new Promise(async (resolve, reject)=> {
            let loginStatus = false
            let response = {}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({ email:userData.email })
             if (user) {
// check if password matches    
       bcrypt.compare(userData.password,user.password).then((status)=> {
                console.log(user.password)
                console.log(userData.password)
              
                    if(status){
                        console.log("login success...");
                        response.user=user
                        response.status=true
                        resolve(response)

                    }else{

                        console.log('login failed');
                        resolve({status:false})

                    }
                })
            }else{
                console.log("login falied because email not there..")
                resolve({status: false})
            }
        })
  
},

   addToCart:(proId,userId)=>{
       return new Promise(async(resolve,reject)=>{
           let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
           if(userCart){
               db.get().collection(collection.CART_COLLECTION)
               .updateOne({user:objectId(userId)},
                {
 
                        $push:{products:objectId(proId)} 
               
                }
               ).then((response)=>{
                   resolve()
               })
           }else{
               let cartObj={
                   user:objectId(userId),
                   products:[objectId(proId)]
               }  
               db.get().collection(collection.CART_COLLECTION).insertOne (cartObj).then((response)=>{
                   resolve() 
               })
           }

       })
   },
  getCartProducts:(userId)=>{
      return new Promise(async(resolve,reject)=>{
          let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
              {
                  $match:{user:objectId(userId)}
              },{
                  $lookup:{
                      from:collection.PRODUCT_COLLECTION,
                      let:{prodList:'$products'},
                      pipeline:[
                          {
                              $match:{
                                  $expr:{
                                      $in:['$_id',"$$prodList"]
                                  }
                              }
                          }
                      ],
                      as:'cartItems'
                  }
              }
          ]).toArray()
          resolve(cartItems[0].cartItems)
      })
  },
  getCartCount:(userId)=>{
      return new Promise(async(resolve,reject)=>{
          let count=0
          let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
          if(cart){
              count=cart.products.length
          }
          resolve(count)
      })
  }

}
 
