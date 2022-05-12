 var db=require('../config/connection')
 var collection=require('../config/collections')
 const bcrypt=require('bcrypt')

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            const salt = bcrypt.genSaltSync(10);
            userData.Password=  await bcrypt.hash(userData.Password,salt)
      db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{

          resolve(data) 
      })
           
       


        })
      
      
    }
}