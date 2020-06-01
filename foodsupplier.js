'use strict'

const express = require('express')
const request = require('request')
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
const HOST = '127.0.0.1'

const foodSupplier = (req, res) => {
  res.send(suppliersList[req.query.ingredientQuery])
}

const app = express()

app.get(`/FoodSupplier`, foodSupplier)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}/FoodFinder`)