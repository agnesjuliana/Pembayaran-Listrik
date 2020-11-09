const express = require("express")
const app = express()

app.use(express.urlencoded({extended:true}))

const tarif = require("../models/index").tarif

let validateAdmin = require("./auth/validateAdmin")
app.use(validateAdmin)

//ENDPOINT GET TARIF
app.get("/", (req,res)=> {
    tarif.findAll()
    .then(result=> {
        res.json(result)
    })
    .catch(error=> {
        res.json({
            message: error.message
        })
    })
})

//ENDPOINT TAMBAH TARIF
app.post("/", async(req,res)=> {
    //data preparation
    let data = {
        daya: req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }

    tarif.create(data)
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

//ENDPOINT UPDATE TARIF
app.put("/", async(req,res)=> {
    let data = {
        daya: req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }

    let param = {
        id_tarif: req.body.id_tarif
    }

    tarif.update(data, {where:param})
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

app.delete("/:id_tarif", async(req,res)=> {
    let param = {
        id_tarif: req.params.id_tarif
    }

    tarif.destroy({where:param})
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