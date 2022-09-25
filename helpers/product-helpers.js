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
// doSignup:(adminData)=>{
//   return new Promise(async (resolve, reject)=> {
//     let SignupStatus = false
//     let response = {}
//     let admin= await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email:adminData.email })
//     {
//     if(admin){
//         response.admin=admin
//         response.status=true
//         resolve(response)
//           }
//             else {
//                 resolve( {states:false})
//             }
//       }
//     })
//     },

}