const jwt = require('jsonwebtoken')

function generateToken(email){
    const token = jwt.sign({ email},process.env.JWT_KEY,{expiresIn:300})
    return token
}


module.exports = generateToken
