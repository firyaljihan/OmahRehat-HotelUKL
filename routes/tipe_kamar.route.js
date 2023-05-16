const express = require(`express`)
const app = express()
app.use(express.json())
const tipe_kamar_Controller = require(`../controller/tipe_kamar_controller`)


app.get("/getAllTipeKamar", tipe_kamar_Controller.getAllTipeKamar)
app.post("/findTipeKamar", tipe_kamar_Controller.findTipeKamar)
app.post("/addTipeKamar", tipe_kamar_Controller.addTipeKamar)
app.put("/updateTipeKamar/:id", tipe_kamar_Controller.updateTipeKamar)
app.delete("/deleteTipeKamar/:id", tipe_kamar_Controller.deleteTipeKamar)

module.exports = app