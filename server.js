//CALL LIBRARY
const express = require("express")
const app = express()

//INCLUDE ROUTER
let tarif = require ("./router/r_tarif")
let admin = require ("./router/r_admin")
let level = require ("./router/r_level")
let pelanggan = require ("./router/r_pelanggan")
let pembayaran = require ("./router/r_pembayaran")
let penggunaan = require ("./router/r_penggunaan")
let tagihan = require ("./router/r_tagihan")
let login = require ("./router/auth/auth")

//ROUTING
app.use("/listrik/tarif", tarif)
app.use("/listrik/admin", admin)
app.use("/listrik/level", level)
app.use("/listrik/pelanggan", pelanggan)
app.use("/listrik/pembayaran", pembayaran)
app.use("/listrik/penggunaan", penggunaan)
app.use("/listrik/tagihan", tagihan)
app.use("/listrik/login",login)

//RUNNING SERVER
app.listen(3000, () => {
    console.log("server running success, Have a Good Day Agnes!")
})
