 var db=require('../config/connection')
 var collection=require('../config/collections')
 const bcrypt=require('bcrypt')
const { promise } = require('bcrypt/promises')
const { route } = require('../routes/user')

// module.exports={
//     doSignup:(userData)=>{
//         return new Promise(async(resolve,reject)=>{
//             // var salt =  await bcrypt.genSalt(10);
//             bcrypt.genSalt(10,(err,salt) => {
//                 bcrypt.hash(newUser.password, salt , (err, hash) =>{
//                  if(err) throw (err);
         
//                  newUser.password=hash;
//                  newUser.save(callback);
//                 });

module.exports={
    doSignup:(userData)=>{ 
        return new Promise((resolve,reject)=>{
              bcrypt.genSalt(10,(err,salt) => {
       userData.Password=  bcrypt.hash(userData.Password, salt )

        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{

            resolve(data) 
        });
        });
         });
        
            },
        
    
        
        
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        resolve.user=user
                        response.status=true
                        resolve (response)

                    }else{

                        console.log('login failed');
                        resolve({status:false})

                    }
                })
            }else{
                console.log("login falied")
                resolve({status: false})
            }
        })

    }
  
}
