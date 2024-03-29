var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt');

var objectId = require('mongodb').ObjectId
const Razorpay = require('razorpay');


var instance = new Razorpay({
    key_id: 'rzp_test_Nc7FgdyoVta2ee',
    key_secret: 'u5Yn0DsaZf0QyRxxGFzDtink',
});

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            userData.confirm_password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(userData)
            });
        });
    },

    exists: (userData) => {
        return new Promise(async (resolve, reject) => {
            let SignupStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            {
                if (user) {
                    response.user = user
                    response.status = true
                    resolve(response)

                }
                else {
                    resolve({ states: false })
                }
            }
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                // check if password matches    
                bcrypt.compare(userData.password, user.password).then((status) => {
                    console.log(user.password)
                    console.log(userData.password)

                    if (status) {
                        console.log("login success...");
                        response.user = user
                        response.status = true
                        resolve(response)

                    } else {

                        console.log('login failed');
                        resolve({ status: false })

                    }
                })
            } else {
                resolve({ status: false })
            }
        })

    },

    addToCart: (proId, userId) => {
        let proObj = {
            item: objectId(proId),
            quantity: 1,

        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                let proExist = userCart.products.findIndex(product => product.item == proId)
                console.log('proExist>>>>>>>.', proExist);
                if (proExist != -1) {
                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne({ user: objectId(userId), 'products.item': objectId(proId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then(() => {
                            resolve()
                        })
                } else {

                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne({ user: objectId(userId) },
                            {

                                $push: { products: proObj }

                            }
                        ).then((response) => {
                            resolve()
                        })
                }
            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }

        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                }, {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'


                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()

            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },
    changeproductQuantity: (details) => {
        details.count = parseInt(details.count);
        details.quantity = parseInt(details.quantity)
        console.log('details.count', details.count)
        console.log('details.quantity', details.quantity)
        return new Promise((resolve, reject) => {
            if (details.count == -1 && details.quantity == 1) {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: objectId(details.cart) },
                        {

                            $pull: { products: { item: objectId(details.product) } }
                        }
                    ).then((response) => {
                        resolve({ removeProduct: true })
                    })
            } else {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: objectId(details.cart), 'products.item': objectId(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }
                        }

                    ).then((response) => {

                        resolve({ status: true })

                    })
            }

        })
    },
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                }, {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',

                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: {
                                $multiply: [
                                    {
                                        $toInt: '$quantity'
                                    },
                                    {
                                        $toInt: {
                                            "$replaceAll": {
                                                "input": "$product.Price",
                                                "find": ",",
                                                "replacement": ""
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]).toArray()

            resolve(total.length > 0 ? total[0].total : 0)
        })
    },
    placeOrder: (order, products, total) => {
        return new Promise((resolve, reject) => {
            console.log('xxxxxx', order, products, total);
            let status = order['payment-method'] === 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    mobile: order.mobile,
                    houseadd: order.houseadd,
                    apartment: order.apartment,
                    email: order.email,
                    city: order.city,
                    fname: order.fname,
                    lname: order.lname,
                    selection: order.selection,

                },
                userId: objectId(order.userId),
                paymentMethord: order['payment-method'],
                products: products,
                totalAmount: total,
                status: status,
                date: new Date,

            }

            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collection.CART_COLLECTION).deleteOne({ user: objectId(order.userId) })
                console.log('resposce....>>>>>>>>>>>>>>>>>', response.insertedId)
                resolve(response.insertedId)
            })
        })
    },
    getCartProductlist: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })

            if (cart) {
                resolve(cart.products)
            }
            else {
                reject()
            }
        })
            .catch((message) => {
                console.log('wrong' + message)
            })
    },
    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION)
                .find({ userId: objectId(userId) }).toArray()
            resolve(orders);
        })

    },
    getOrderProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(orderId) }

                },
                {
                    $unwind: '$products'
                }, {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'

                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()
            console.log('orderItems300', orderItems)

            resolve(orderItems)
        })
    },
    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {

            var options = {
                amount: total * 100,
                currency: "INR",
                receipt: "" + orderId,

            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err)
                } else
                    console.log('New order>>>>>>>>>>>>>>.:', order);
                resolve(order)
            });

        })
    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {

            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', 'u5Yn0DsaZf0QyRxxGFzDtink')
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }
        })
    },
    changePaymentStatus: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION)
                .updateOne({ _id: objectId(orderId) },
                    {
                        $set: {
                            status: 'placed'
                        }
                    }).then(() => {
                        resolve()
                    })
        })
    },

    removeProduct: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION)
                .updateOne({ _id: objectId(details.cart) },
                    {
                        $pull: { products: { item: objectId(details.product) } }
                    }
                ).then((response) => {

                    resolve({ removeProduct: true })
                })

        })
    },


    // --------------user profile functions ----------------------

    editUserProfile: (proId, userDetails) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(proId) })
            let userExit = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userDetails.email })
            let response = {}
            if (user.email == userDetails.email) {
                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(proId) }, {
                    $set: {
                        name: userDetails.Name,
                        email: userDetails.email,
                    }
                }).then((response) => {
                    resolve(response)
                })
            } else if (userExit) {
                response.err = true
                resolve(response)

            } else {
                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(proId) }, {
                    $set: {
                        name: userDetails.Name,
                        email: userDetails.email,
                    }
                }).then((response) => {
                    resolve(response)
                })
            }
        })
    },

    changePassword: (userData, userId) => {
        return new Promise(async (resolve, reject) => {
            userData.newPassword = await bcrypt.hash(userData.newPassword, 10)
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {

                $set: {

                    password: userData.newPassword

                }
            }).then((data) => {
                resolve(userData)
            })
        })
    },


}




