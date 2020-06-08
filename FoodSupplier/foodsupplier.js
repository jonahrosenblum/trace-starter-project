'use strict'

// const tracing = require('@opencensus/nodejs');
// const propagation = require('@opencensus/propagation-b3');

// // Creates Zipkin exporter
// const zipkin = require('@opencensus/exporter-zipkin');
// const exporter = new zipkin.ZipkinTraceExporter({
//   url: 'http://localhost:9411/api/v2/spans',
//   serviceName: 'foodsupplier'
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

app.listen(PORT, () => {console.log('Running FoodSupplier')})
//console.log(`Running on http://${HOST}:${PORT}/FoodSupplier`)