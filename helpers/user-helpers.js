 
 const mongoose = require('mongoose');
 var db=require('../config/connection')
 var collection=require('../config/collections')
 const bcrypt=require('bcrypt')
 

 

module.exports={
    doSignup:(userData)=>{
        return new Promise (async(resolve,reject)=>{
         userData.password=  salt=   await bcrypt.genSalt(10);

   const hashedpassword=  await  bcrypt.hash(userData.password,10,(err, password,hash) => {

                if(err) throw (err);
                 else
                password=hash
             
            
                  db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{

                    resolve(data.insertedId) 
                    console.log(userData.password)
     
                });
                });
            })
        
       
// module.exports={
//     doSignup:(userData)=>{ 
//         return new Promise(async(resolve,reject)=>{
//             conat salt = await  bcrypt.genSalt(10,(err,salt) => {
//        userData.Password=  bcrypt.hash(userData.Password, salt )

      
        
        
             }
        
    
        
        
    // doLogin:(userData)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let loginStatus=false
    //         let response={}

    //         let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
    //         if(user){
    //             bcrypt.compare(userData.Password,user.Password).then((status)=>{
    //                 if(status){
    //                     console.log("login success");
    //                     resolve.user=user
    //                     response.status=true
    //                     resolve (response)

    //                 }else{

    //                     console.log('login failed');
    //                     resolve({status:false})

    //                 }
    //             })
    //         }else{
    //             console.log("login falied")
    //             resolve({status: false})
    //         }
    //     })

    // }
  
}
