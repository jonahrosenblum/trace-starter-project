'use strict'

// const tracing = require('@opencensus/nodejs');
// const propagation = require('@opencensus/propagation-b3');

// // Creates Zipkin exporter
// const zipkin = require('@opencensus/exporter-zipkin');
// const exporter = new zipkin.ZipkinTraceExporter({
//   url: 'http://localhost:9411/api/v2/spans',
//   serviceName: 'foodvendor'
// });

// // NOTE: Please ensure that you start the tracer BEFORE initializing express app
// // Starts tracing and set sampling rate, exporter and propagation
// tracing.start({
//   exporter,
//   samplingRate: 1, // For demo purposes, always sample
//   propagation: new propagation.B3Format(),
//   logLevel: 1 // show errors, if any
// });
require('@google-cloud/trace-agent').start()

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

const foodVendor = (req, res) => {
  if (!req.query) {
    res.send({})
    return
  }
  const vendor = req.query.vendorQuery
  const ingredient = req.query.ingredientQuery
  if (!vendor || !ingredient) {
    res.send({})
    return
  }
  const randomDelay = Math.floor(Math.random() * 50)
  setTimeout(()=>{
    try {
      const vendorInfo = vendorsList[req.query.vendorQuery][req.query.ingredientQuery]
      vendorInfo['vendorName'] = req.query.vendorQuery
      res.send(vendorInfo)
    }
    catch(error) {
      res.send({})
    }
  }, randomDelay)
}

const app = express()

app.get(`/FoodVendor`, foodVendor)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {console.log(`Running FoodVendor!`)})