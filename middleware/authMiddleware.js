const  jwt = require ('jsonwebtoken')


const protect =( (req, res, next) => { 


const token = req.cookies.jwt;
  if (token) {
    try { 
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
     console.log('jwt',decoded) 
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not Authorized, Token Failed.')
    }
  }

  if (!token) {
    res.status(401)
    res.redirect('/user/signup')  
    throw new Error('Not Authorized, No Token.')
  }
// })
})


module.exports = protect
