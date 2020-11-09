const express = require("express")
const auth = express()
const md5 = require("md5")

//REQUIRE MODEL ADMIN
const modelAdmin = require("../../models/index").admin
const modelPelanggan = require("../../models/index").pelanggan

//CALL JWT LIBRARY
const jwt = require("jsonwebtoken")
const SECRET_KEY_ADMIN = "adminsecret"
const SECRET_KEY_PELANGGAN = "usersecret"

auth.use(express.urlencoded({extended: true}))

auth.post("/", async(req,res)=>{
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let admin = await modelAdmin.findOne({where:data})
    let pelanggan = await modelPelanggan.findOne({where:data})

    if(admin) {
        let payload = JSON.stringify(admin)

        return res.json({
            data: admin,
            token: jwt.sign(payload, SECRET_KEY_ADMIN)
        })
    }else if (pelanggan){
        let payload = JSON.stringify(pelanggan)

        return res.json({
            data: pelanggan,
            token: jwt.sign(payload, SECRET_KEY_PELANGGAN)
        })
    }else{
        return res.json({
            message: "invalid username or password"
        })
    }
})

// auth.post("/loginpelanggan", async(req,res)=>{
//     let data = {
//         username: req.body.username,
//         password: req.body.password
//     }

//     let result = await admin.findOne({where:data})

//     if(result) {
//         let payload = JSON.stringify(result)
//         return res.json({
//             data: result,
//             token: jwt.sign(payload, SECRET_KEY_PELANGGAN)
//         })
//     }

//     return res.json({
//         message: "invalid username or password"
//     })
// })


module.exports = auth