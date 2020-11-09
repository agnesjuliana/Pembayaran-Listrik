const express = require("express")
const app = express()
const md5 = require("md5")

let validateAdmin = require("./auth/validateAdmin")
let validateUser = require("./auth/validateUser")


//express urlencoded untuk request data dari body
app.use(express.urlencoded({extended:true}))

//panggil model pelanggan
const pelanggan = require("../models/index").pelanggan

app.get("/",validateAdmin, (req,res)=> {
    pelanggan.findAll({
        include: ["tarif"]
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
        nomor_kwh: req.body.nomor_kwh,
        nama_pelanggan: req.body.nama_admin,
        alamat: req.body.alamat,
        id_tarif: req.body.id_tarif,
    }

    pelanggan.create(data)
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
app.put("/",validateUser, async(req,res)=> {
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nomor_kwh: req.body.nomor_kwh,
        nama_pelanggan: req.body.nama_pelanggan,
        alamat: req.body.alamat,
        id_tarif: req.body.id_tarif,
    }

    let param = {
        id_pelanggan: req.body.id_pelanggan
    }

    pelanggan.update(data, {where:param})
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
app.delete("/:id_pelanggan",validateUser, async(req,res)=> {
    let param = {
        id_pelanggan: req.params.id_pelanggan,
    }

    pelanggan.destroy({where:param})
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