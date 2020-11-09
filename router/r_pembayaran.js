const express = require("express")
const app = express()

const multer = require("multer")
const path = require("path")
const fs = require("fs")

let validateAdmin = require("./auth/validateAdmin")
let validateUser = require("./auth/validateUser")


const storage = multer.diskStorage({
    destination: (req,res,cb)=> {
        cb(null, "./image")
    },
    filename: (req,file,cb)=>{
        cb(null, "cover-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})


const tagihan = require("../models/index").tagihan
const pembayaran = require("../models/index").pembayaran
const penggunaan = require("../models/index").penggunaan
const pelanggan = require("../models/index").pelanggan

app.get("/",validateAdmin, (req,res)=> {
    pembayaran.findAll({
        include: ["tagihan"]
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

//POST agnes
app.post("/", upload.single("bukti"),validateUser, async(req,res)=> {
    let param = {
        id_tagihan: req.body.id_tagihan
    }
    
    let result = await tagihan.findOne({
        where:param,
        include: [
            {
                model: penggunaan,
                as: "penggunaan",
                include: [
                    {
                        model: pelanggan,
                        as: "pelanggan",
                        include: ["tarif"]
                    }
                ]
            }
        ]
    })
    let tarif = result.penggunaan.pelanggan.tarif.tarifperkwh

    let jumlah_meter = result.jumlah_meter
    let biaya_admin = parseInt(req.body.biaya_admin)
    let total = jumlah_meter*tarif+biaya_admin

    let data = {
        id_tagihan: req.body.id_tagihan,
        bulan_bayar: req.body.bulan_bayar,
        tanggal_pembayaran: Date.now(),
        biaya_admin: req.body.biaya_admin,
        total_bayar: total,
        status: 0,
        bukti: req.file.filename,
        id_admin: req.body.id_admin
    }

    pembayaran.create(data)
        .then(result => {
            res.json({
                message: "Data has been inserted",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//UPDATE STATUS agnes
app.put("/", validateAdmin, async(req,res)=> {
    let data = {
        status: req.body.status
    }

    let param = {
        id_pembayaran: req.body.id_pembayaran
    }

    pembayaran.update(data, {where:param})
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


//DELETE DATA PEMBAYARAN
app.delete("/:id_pembayaran", validateAdmin, async(req,res)=>{
    let param = { id_pembayaran: req.params.id_pembayaran }

    let hasil = await pembayaran.findOne({where:param})
    let oldBukti = hasil.bukti

    let pathFile = path.join(__dirname, "../image",oldBukti)
    fs.unlink(pathFile, err => console.log(err))

    pembayaran.destroy({where : param})
    .then(result => {
        res.json({
            message: "Data has been destroyed",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})


module.exports = app

