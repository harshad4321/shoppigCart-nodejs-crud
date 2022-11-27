 var db=require('../config/connection')
 var collection=require('../config/collections')
 var objectId=require('mongodb').ObjectId

 module.exports={
     addProduct:(product,callback)=>{
    db.get().collection('product').insertOne(product).then((data)=>{
      console.log("data",data);  
      callback(data.insertedId)
    })
  },    
     getAllProducts:()=>{ 
        return new Promise(async(resolve,reject)=>{
             let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
             resolve(products)
        })
     },
     deleteProduct:(prodId)=>{
     return new Promise((resolve,reject)=>{
       console.log(prodId);
       console.log(objectId(prodId));
       db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
        //  console.log(response)
         resolve(response)})
     })
     },
     getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
        resolve(product)
      })
    })
  },
  updateProduct:(proId,proDetails)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION)
       .updateOne({_id:objectId(proId)},{
        $set:{
          Name:proDetails.Name,
          Category:proDetails.Category,
          Brand:proDetails.Brand,
          Price:proDetails.Price,
          Description:proDetails.Description,
        }
      }).then((response)=>{
        resolve()
      }) 
    })
},
  addProductsReview:(reviews,callback)=>{

let reviewobj={ 
  userName:reviews.userName,
  commant:reviews.comment,
  userId:objectId(reviews.userId),
  productId:objectId(reviews.productId),
  date:new Date
}
console.log('>>>>>>>>>>>>>>>>>>>>>commant:reviews.comment[[[[[[[[[[[[[[[',reviews.comment);


    db.get().collection('reviews').insertOne(reviewobj).then((data)=>{
          
      console.log("data>>>>reviewsreviewsreviewsreviewsreviews00>>00>>>>>>>>",reviewobj);  
      callback(data.insertedId)
    })
  },    
    
     getAllProductsReview:(proId)=>{ 
            return new Promise(async(resolve,reject)=>{
              let reviews=await db.get().collection(collection.REVIEWS_COLLECTION).findOne({productId:objectId(proId)}).then((reviews)=>{
        resolve(reviews)
      })
    })
  },
    



editProductsReview: (proId, userDetails) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(proId) })
        let userExit = await db.get().collection(collection.REVIEWS_COLLECTION).findOne({ userId:objectId(userDetails) })
        let response = {}
        // if (user.email == userDetails.email) {
            db.get().collection(collection.REVIEWS_COLLECTION).updateOne({ _id: objectId(proId)}, {
                $set: {
                   userName:reviews.userName,
                   commant:reviews.comment,
                   userId:objectId(reviews.userId),
                   productId:objectId(reviews.productId),
                   date:new Date
                }
            }).then((response) => {
                resolve(response)
            })
        // } else if (userExit) {
        //     response.err = true
        //     resolve(response)

        // } else {
        //     db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(proId) }, {
        //         $set: {
        //             name: userDetails.Name,
        //             email: userDetails.email,
        //          }
        //     }).then((response) => {
        //         resolve(response)
        //     })
        // }
    })
},

 deletereview:(userId)=>{
     return new Promise((resolve,reject)=>{
       console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm>>>>',userId);
       console.log(objectId(userId));
       db.get().collection(collection.REVIEWS_COLLECTION).deleteOne({userId:objectId(userId)}).then((response)=>{
        //  console.log(response)
         resolve(response)})
     })
     },


}