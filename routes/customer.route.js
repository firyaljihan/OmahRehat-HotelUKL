const express = require(`express`)
const app = express()
app.use(express.json())
const customerController = require(`../controller/customer_controller`)


app.get("/getAllCust", customerController.getAllCustomer)
app.post("/findCust", customerController.findCustomer)
app.post("/addCust", customerController.addCustomer)
app.put("/updateCust", customerController.updateCustomer)
app.delete("/deleteCust", customerController.deleteCustomer)

module.exports = app 