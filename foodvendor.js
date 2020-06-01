'use strict'

const express = require('express')
const fs = require('fs')

let vendorsList

fs.readFile('vendors.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err)
  }
  vendorsList = JSON.parse(data)
})


// Constants
const PORT = 7502
const HOST = '127.0.0.1'

const foodVendor = (req, res) => {
  const randomDelay = Math.floor(Math.random() * 1000)

  setTimeout(()=>{
    const vendorInfo = vendorsList[req.query.vendorQuery][req.query.ingredientQuery]
    vendorInfo['vendorName'] = req.query.vendorQuery

    res.send(vendorInfo)
  }, randomDelay)
}

const app = express()

app.get(`/FoodVendor`, foodVendor)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}/FoodFinder`)