'use strict'

const express = require('express')
const fs = require('fs')

let suppliersList

fs.readFile('suppliers.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err)
  }
  suppliersList = JSON.parse(data)
})


// Constants
const PORT = 7501

const foodSupplier = (req, res) => {
  if (!req.query || !req.query.ingredientQuery) {
    res.send([])
    return
  }
  res.send(suppliersList[req.query.ingredientQuery])
}

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get(`/FoodSupplier`, foodSupplier)

app.listen(PORT, () => {console.log('Running FoodSupplier!')})
//console.log(`Running on http://${HOST}:${PORT}/FoodSupplier`)