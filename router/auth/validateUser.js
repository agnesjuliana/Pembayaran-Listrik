const jwt = require("jsonwebtoken")
const SECRET_KEY_USER = "usersecret"

validateUser = (req, res, next) => {
    let header = req.headers.authorization
    let token = header ? header.split(" ")[1] : null
    let jwtHeader = { 
        algorithm: "HS256",
        expiresIn: "5h"
    }

    if (token == null) {
        return res.json({ message: "Unauthorized" })
    } else {
        jwt.verify(token, SECRET_KEY_USER, jwtHeader, (error, user) => {
            if (error) {
                return res.json({ message: error.message })
            } else {
                next()
            }

        })
    }

}

module.exports = validateUser