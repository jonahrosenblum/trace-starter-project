'use strict'

const { NodeTracerProvider } = require('@opentelemetry/node')
const { BatchSpanProcessor } = require('@opentelemetry/tracing');
const { StackdriverTraceExporter } = require('@opentelemetry/exporter-stackdriver-trace')
 
const exporter = new StackdriverTraceExporter({});
const provider = new NodeTracerProvider({serviceName: 'foodvendor'});

provider.addSpanProcessor(new BatchSpanProcessor(exporter))
provider.register()

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