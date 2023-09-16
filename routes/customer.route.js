const express = require(`express`)
const app = express()
app.use(express.json())
const customerController = require(`../controller/customer_controller`)
const auth = require('../auth/authCust')

app.post("/loginCust", customerController.login)
app.get("/getAllCust",customerController.getAllCustomer)
app.post("/findCust",auth.authCust, customerController.findCustomer)
app.post("/addCust",auth.authCust, customerController.addCustomer)
app.put("/updateCust",auth.authCust, customerController.updateCustomer)
app.delete("/deleteCust",auth.authCust, customerController.deleteCustomer)

module.exports = app 