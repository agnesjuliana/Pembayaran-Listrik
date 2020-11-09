const express = require("express")
const md5 = require("md5")
const app = express()

app.use(express.urlencoded({extended:true}))

const admin = require("../models/index").admin

let validateAdmin = require("./auth/validateAdmin")
app.use(validateAdmin)

app.get("/", (req,res)=> {
    admin.findAll({
        include: ["level"]
    })
    .then(result=> {
        res.json(result)
    })
    .catch(error=> {
        res.json({
            message: error.message
        })
    })
})

//REGISTRATION
app.post("/regist", async(req,res)=> {
    //data preparation
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nama_admin: req.body.nama_admin,
        id_level: req.body.id_level,
    }

    admin.create(data)
    .then(result => {
        res.json({
            message: "Data has been inserted!",
            data: result
        })
    })
    .catch(error=> {
        res.json({
            message: error.message
        })
    })
})

//ENDPOINT UPDATE 
app.put("/", async(req,res)=> {
    let data = {
        username: req.body.username,
        password: req.body.password,
        nama_admin: req.body.nama_admin,
        id_level: req.body.id_level,
    }

    let param = {
        id_admin: req.body.id_admin
    }

    admin.update(data, {where:param})
    .then(result => {
        res.json({
            message: "Data has been updated!",
            data: result
        })
    })
    .catch(error=> {
        res.json({
            message: error.message
        })
    })
})

//END POINT DELETE
app.delete("/:id_admin", async(req,res)=> {
    let param = {
        id_admin: req.params.id_admin,
        password: md5(req.body.password)
    }

    admin.destroy({where:param})
    .then(result=> {
        res.json({
            message: "Data has been deleted!"
        })
    })
    .catch(error=> {
        res.json({
            message:error.message
        })
    })
})

module.exports = app