 

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
       let proObj={
           item:objectId(proId),
           quantity:1,
           
       }
       return new Promise(async(resolve,reject)=>{
           let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
           if(userCart){
               let proExist=userCart.products.findIndex(product=> product.item==proId)
console.log(proExist);
if(proExist!=-1){
    db.get().collection(collection.CART_COLLECTION)
    .updateOne({user:objectId(userId),'products.item':objectId(proId)},
{
    $inc:{'products.$.quantity':1}
}
).then(()=>{
    resolve()
})
}else{
           
               db.get().collection(collection.CART_COLLECTION)
               .updateOne({user:objectId(userId)},
                {
 
                        $push:{products:proObj} 
               
                }
               ).then((response)=>{
                   resolve()
               })
            }
           }else{
               let cartObj={
                   user:objectId(userId),
                   products:[proObj]
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
              },
              {
                  $unwind:'$products'
              },{
                  $project:{
                      item:'$products.item',
                      quantity:'$products.quantity'
              

                  }
              },
              {
                  $lookup:{
                      from:collection.PRODUCT_COLLECTION,
                      localField:'item',
                      foreignField:'_id',
                      as:'product'
                  }
              },
              {
                  $project:{
                      item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                  }
              }

          ]).toArray()
        
          resolve(cartItems)
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
  },
  changeproductQuandity:(details)=>{
    details.count=parseInt(details.count);
  details.quantity=parseInt(details.quantity)
 

      return new Promise((resolve,reject)=>{
          if(details.count==-1 && details.quantity==1){
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objectId(details.cart)}, 
        {

            $pull:{products:{item:objectId(details.product)}}
        }
            ).then((response)=>{

                resolve({removeProduct:true})
            })
        }else{
      db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
            {
                $inc:{'products.$.quantity':details.count}
            }
            
            ).then((response)=>{ 
                resolve({status:true})
            })  
        }

      })
  },
  getTotalAmount:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{user:objectId(userId)}
            },
            {
                $unwind:'$products'
            },{
                $project:{
                    item:'$products.item',
                    quantity:'$products.quantity',
                 

                }
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
            },
            {
                $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                } 
            },
            {
                $group:{ 
                    _id:null,
                    total:{$sum:{$multiply:[{ $toInt: '$quantity' },{ $toInt: '$product.Price' }]}}
                }
            }
 
        ]).toArray()
        console.log(total[0].total)
        resolve(total[0].total)
    })
} ,
placeOrder:(order,products,total)=>{
return new Promise((resolve,reject)=>{
    console.log(order,products,total);
    let status=order['payment-method']==='COD'?'placed':'pending'
    let orderObj={
       deliveryDetails:{
            mobile:order.mobile,
              houseadd:order.houseadd,
            apartment:order. apartment,
            email:order.email,
            city:order.city,
            fname:order.fname,
            lname: order.lname,
            selection:order.selection
          

        },
        userId:objectId(order.userId),
        paymentMethord:order['payment-method'],
        products:products,
        totalAmount:total,
        status:status,
        data:new Date
    }

    db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
        db.get().collection(collection.CART_COLLECTION). deleteOne({user:objectId(order.userId)})
        resolve()

    })
})
},
getCartProductlist:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        let cart= await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        resolve(cart.products)

    })

},
getUserOrder:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        console.log(userId);
        let orders=await db.get.collection(collection.ORDER_COLLECTION)
        .find({userId:objectId(userId)}).toArray()
        console.log(orders);
        resolve(orders)
    })

}
  
  }



 
