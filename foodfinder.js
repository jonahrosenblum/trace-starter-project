'use strict'

const express = require('express')
const request = require('request')

// Constants
const PORT = 7500
const HOST = '127.0.0.1'

const queryAllVendors = (vendors, ingredient, res) => {
  const vendorsInfo = []
  vendors.forEach( (vendor) => {
    const vendorOptions = {
      url: `http://${HOST}:${PORT + 2}/FoodVendor`,
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
    url: `http://${HOST}:${PORT + 1}/FoodSupplier`,
    qs: {
      'ingredientQuery': ingredient
    }
  }

  request(supplierOptions, (err, response, supplierBody) => {
    queryAllVendors(JSON.parse(supplierBody), ingredient, res)
  })
}


const app = express()

app.get('/FoodFinder', foodFinder)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}/FoodFinder`)