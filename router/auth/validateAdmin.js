const jwt = require("jsonwebtoken")
const SECRET_KEY_ADMIN = "adminsecret"



ValidateAdmin = (req,res, next) => {
    let header = req.headers.authorization
    let token = header ? header.split(" ")[1] : null
    let jwtHeader = {algorithm: "HS256"}

    if (token == null){
        return res.json({message: "Unauthorized"})
    } else{
        jwt.verify(token,SECRET_KEY_ADMIN, jwtHeader, (error, user) => {
            if(error){
                return res.json({ message: "Invalid Token"})
            }else{
                next() 
            }
            
        })
    }
}

module.exports = ValidateAdmin