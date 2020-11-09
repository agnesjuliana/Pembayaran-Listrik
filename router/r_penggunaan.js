const express = require("express")
const app = express()

//express urlencoded untuk request data dari body
app.use(express.urlencoded({extended:true}))

const penggunaan = require("../models/index").penggunaan

let validateAdmin = require("./auth/validateAdmin")
app.use(validateAdmin)

app.get("/", (req,res)=> {
    penggunaan.findAll({
        include: ["pelanggan"]
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

//INSERT TAGIHAN
app.post("/", async(req,res)=> {
    //data preparation
    let data = {
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir,
    }

    penggunaan.create(data)
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
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir,
    }

    let param = {
        id_penggunaan: req.body.id_penggunaan
    }

    penggunaan.update(data, {where:param})
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
app.delete("/:id_penggunaan", async(req,res)=> {
    let param = {
        id_penggunaan: req.params.id_pelanggan,
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