'use strict'

const express = require('express')
const request = require('request')
const fs = require('fs')


let suppliers, vendors

fs.readFile('suppliers.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err)
  }
  suppliers = JSON.parse(data)
})

fs.readFile('vendors.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err)
  }
  vendors = JSON.parse(data)
})


// Constants
const PORT = 8081
const HOST = '0.0.0.0'

const queryAllVendors = async (vendors, ingredient, res) => {
  // By making a request for each vendor seperately we can make multiple asynchronous requests
  const vendorsInfo = []
  await vendors.forEach( async (vendor) => {
    const vendorOptions = {
      url: `http://${HOST}:${PORT}/FoodVendor`,
      qs: {
        'vendorQuery': vendor,
        'ingredientQuery': ingredient
      }
    }
    await request(vendorOptions, (err, response, vendorBody) => {
      //return vendorBody
      vendorsInfo.push(vendorBody)
      // if (vendorsInfo.length == vendors.length) {
      //   flag = false
      //   console.log('flag now false')
      // }
      // console.log(vendorsInfo.length, vendors.length)
    })
    console.log(vendorsInfo)
  })

  res.send(vendorsInfo)
}

const foodFinder = async (req, res) => {
  const ingredient = req.query.ingredient
  const supplierOptions = {
    url: `http://${HOST}:${PORT}/FoodSupplier`,
    qs: {
      'ingredientQuery': ingredient
    }
  }

  await request(supplierOptions, (err, response, supplierBody) => {
    const vendors = queryAllVendors(JSON.parse(supplierBody), ingredient, res)
  })

}

const foodSupplier = (req, res) => {
  res.send(suppliers[req.query.ingredientQuery])
}

const foodVendor = (req, res) => {
  const randomDelay = Math.floor(Math.random() * 1000)
  setTimeout(()=>{
    const vendorInfo = vendors[req.query.vendorQuery][req.query.ingredientQuery]
    vendorInfo['vendorName'] = req.query.vendorQuery
    res.send(vendorInfo)
  }, randomDelay)
}

const app = express()

app.get('/FoodFinder', foodFinder)

app.get(`/FoodSupplier`, foodSupplier)

app.get(`/FoodVendor`, foodVendor)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)