var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
var bcrypt = require('bcrypt');
const { response } = require('../app');

module.exports = {
    doAdminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let adminLoginStatus = false;
            let adminResponse = {};
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
            console.log(admin);
            if (admin) {
                if (adminData.password == admin.password) {
                    adminResponse.admin = admin;
                    adminResponse.status = true;
                    resolve(adminResponse)
                    console.log('Login successfully!');
                } else {
                    adminResponse.status = false
                    resolve(adminResponse)
                    console.log('Login Failed');
                }

            } else {
                console.log('some thing else, Login Failed');
                resolve(adminResponse.status = false)
            }

        })
    }

}