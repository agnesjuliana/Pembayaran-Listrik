const express = require("express")
const app = express()

app.use(express.urlencoded({extended:true}))

let validateAdmin = require("./auth/validateAdmin")
let validateUser = require("./auth/validateUser")

const tagihan = require("../models/index").tagihan
const penggunaan = require("../models/index").penggunaan

//MENAMPILKAN TAGIHAN BERDASARKAN ID PELANGGAN
app.get("/:id_pelanggan",validateUser, (req,res)=> {
    let id = {
        id_pelanggan: req.params.id_pelanggan
    }
    tagihan.findOne({
        where:id,
        include: ["penggunaan"]
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

app.get("/",validateAdmin, (req,res)=> {
    tagihan.findAll({
        include: ["penggunaan"]
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

//POST TAGIHAN
app.post("/", validateAdmin, async(req,res) => {

    let param = {
        id_penggunaan: req.body.id_penggunaan
    }
    
    let pengguna = await penggunaan.findOne({where:param})
    let meter_awal = pengguna.meter_awal
    let meter_akhir = pengguna.meter_akhir
    let jumlah_meter = meter_akhir-meter_awal



    let data = {
        id_penggunaan: req.body.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: jumlah_meter,
        status: 0
    }

    tagihan.create(data)
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

//UPDATE STATUS TAGIHAN
app.put("/",validateAdmin, async(req,res)=> {
    let data = {
        status: req.body.status
    }

    let param = {
        id_tagihan: req.body.id_tagihan
    }

    tagihan.update(data, {where:param})
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
app.delete("/:id_tagihan", validateAdmin, async(req,res)=> {
    let param = {
        id_penggunaan: req.params.id_tagihan,
    }

    penggunaan.destroy({where:param})
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