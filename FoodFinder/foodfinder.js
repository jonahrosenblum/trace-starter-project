'use strict'

// const path = require('path');
// const cookieParser = require('cookie-parser');
// const tracing = require('@opencensus/nodejs');
// const propagation = require('@opencensus/propagation-b3');

// // Creates Zipkin exporter
// const zipkin = require('@opencensus/exporter-zipkin');
// const exporter = new zipkin.ZipkinTraceExporter({
//   url: 'http://localhost:9411/api/v2/spans',
//   serviceName: 'foodfinder'
// });

// // NOTE: Please ensure that you start the tracer BEFORE initializing express app
// // Starts tracing and set sampling rate, exporter and propagation
// tracing.start({
//   exporter,
//   samplingRate: 1, // For demo purposes, always sample
//   propagation: new propagation.B3Format(),
//   logLevel: 1 // show errors, if any
// });

const express = require('express')
const request = require('request')

// Constants
const PORT = 7500
const HOST = '127.0.0.1'

const queryAllVendors = async (vendors, ingredient, res) => {
  const vendorsInfo = []
  // It is possible for the promises to resolve in different orders but the list will always be the same
  vendors.forEach( (vendor) => {
    const vendorOptions = {
      url: `http://${'35.243.156.184'}:${80}/FoodVendor`,
      qs: {
        'vendorQuery': vendor,
        'ingredientQuery': ingredient
      }
    }
    vendorsInfo.push(new Promise((resolve, reject) => {
        request(vendorOptions, (err, response, vendorBody) => {
            resolve(vendorBody)
        })
    }))
  })
  Promise.all(vendorsInfo)
  .then((values) => {
      res.send(values)
  })
}

const foodFinder = async (req, res) => {
  const ingredient = req.query.ingredient
  if (!ingredient) {
    res.send("Ingredient not specified")
    return
  }
  const supplierOptions = {
    url: `http://${'35.237.213.124'}:${80}/FoodSupplier`,
    qs: {
      'ingredientQuery': ingredient
    }
  }


  request(supplierOptions, (err, response, supplierBody) => {
    try {
      console.log(supplierBody)
      queryAllVendors(JSON.parse(supplierBody), ingredient, res)
    }
    catch(e) {
      res.send('Error:' + e.message)
    }
  })
}


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/FoodFinder', foodFinder)

app.get('/', (req, res) => {res.send('Go to `/FoodFinder` to search for ingredients')})

app.listen(PORT, () => {console.log(`Running FoodFinder`)})