'use strict'

const express = require('express')
const request = require('request')
const fs = require('fs')


let suppliersList, vendorsList

fs.readFile('suppliers.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err)
  }
  suppliersList = JSON.parse(data)
})

fs.readFile('vendors.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err)
  }
  vendorsList = JSON.parse(data)
})


// Constants
const PORT = 8081
const HOST = '0.0.0.0'

const queryAllVendors = (vendors, ingredient, res) => {
  const vendorsInfo = []
  vendors.forEach( (vendor) => {
    const vendorOptions = {
      url: `http://${HOST}:${PORT}/FoodVendor`,
      qs: {
        'vendorQuery': vendor,
        'ingredientQuery': ingredient
      }
    }

    request(vendorOptions, (err, response, vendorBody) => {
      vendorsInfo.push(vendorBody)
      // because we cannot 'return' from a callback, we will send a response
      // once all of the asynchronous calls have completed
      if (vendorsInfo.length == vendors.length) {
        res.send(JSON.stringify(vendorsInfo))
      }
    })

  })
}

const foodFinder = async (req, res) => {
  const ingredient = req.query.ingredient
  const supplierOptions = {
    url: `http://${HOST}:${PORT}/FoodSupplier`,
    qs: {
      'ingredientQuery': ingredient
    }
  }

  request(supplierOptions, (err, response, supplierBody) => {
    queryAllVendors(JSON.parse(supplierBody), ingredient, res)
  })
}

const foodSupplier = (req, res) => {
  res.send(suppliersList[req.query.ingredientQuery])
}

const foodVendor = (req, res) => {
  const randomDelay = Math.floor(Math.random() * 1000)

  setTimeout(()=>{
    const vendorInfo = vendorsList[req.query.vendorQuery][req.query.ingredientQuery]
    vendorInfo['vendorName'] = req.query.vendorQuery

    res.send(vendorInfo)
  }, randomDelay)
}

const app = express()

app.get('/FoodFinder', foodFinder)

app.get(`/FoodSupplier`, foodSupplier)

app.get(`/FoodVendor`, foodVendor)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}/FoodFinder`)