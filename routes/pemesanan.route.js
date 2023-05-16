const express = require(`express`)
const app = express()
app.use(express.json())
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const pemesanan_Controller = require(`../controller/pemesanan_controller`)
// const auth = require(`../auth/auth`)


app.get("/getAllPemesanan",  pemesanan_Controller.getAllPemesanan)
app.post("/findPemesanan",  pemesanan_Controller.findPemesanan)
app.post("/addPemesanan",  pemesanan_Controller.addPemesanan)
app.put("/updatePemesanan/:id", pemesanan_Controller.updatePemesanan)
app.delete("/deletePemesanan/:id",  pemesanan_Controller.deletePemesanan)
app.put("/updateBooking/:id", pemesanan_Controller.updateStatusBooking)

module.exports = app