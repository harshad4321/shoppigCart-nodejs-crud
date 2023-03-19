const jwt = require('jsonwebtoken')

// generating token
maxAge = 60 * 1000 * 60 * 3
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
}


module.exports = generateToken