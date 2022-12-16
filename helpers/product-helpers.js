var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId



module.exports = {
  addProduct: (product, callback) => {
    db.get().collection('product').insertOne(product).then((data) => {
      callback(data.insertedId)
    })
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
      resolve(products)
    })
  },
  deleteProduct: (prodId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(prodId) }).then((response) => {
        resolve(response)
      })
    })
  },
  getProductDetails: (proId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
        resolve(product)
      })
    })
  },
  updateProduct: (proId, proDetails) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION)
        .updateOne({ _id: objectId(proId) }, {
          $set: {
            Name: proDetails.Name,
            Category: proDetails.Category,
            Brand: proDetails.Brand,
            Price: proDetails.Price,
            Description: proDetails.Description,
          }
        }).then((response) => {
          resolve()
        })
    })
  },
  addProductsReview: (reviews, callback) => {

    let reviewobj = {
      userName: reviews.userName,
      commant: reviews.comment,
      userId: objectId(reviews.userId),
      productId: objectId(reviews.productId),
      date: new Date
    }



    db.get().collection('reviews').insertOne(reviewobj).then((data) => {

      callback(data.insertedId)
    })
  },

  getAllProductsReview: (proId) => {
    return new Promise(async (resolve, reject) => {
      let reviews = await db.get().collection(collection.REVIEWS_COLLECTION).find({ productId: objectId(proId) }).toArray()
      resolve(reviews)
    })
  },




  getProductsReview: (reviewId) => {
    return new Promise(async (resolve, reject) => {
      let reviews = await db.get().collection(collection.REVIEWS_COLLECTION).findOne({ _id: objectId(reviewId) }).then((reviews) => {

        resolve(reviews)

      })
    })
  },




  editProductsReview: (reviewId, reviews) => {
    return new Promise(async (resolve, reject) => {
      await db.get().collection(collection.REVIEWS_COLLECTION)
        .updateOne({ _id: objectId(reviewId) }, {
          $set: {
            userName: reviews.userName,
            commant: reviews.comment,
            userId: objectId(reviews.userId),
            productId: objectId(reviews.productId),
            date: new Date
          }
        }).then((response) => {
          resolve(response)

        })
    })
  },

  deletereview: (prUserId) => {
    console.log('000000000000----user ----000000kkkk>.', prUserId);
    return new Promise((resolve, reject) => {
      db.get().collection(collection.REVIEWS_COLLECTION).deleteOne({ userId: objectId(prUserId) }).then((response) => {
        resolve(response)
      })
    })
  },


}