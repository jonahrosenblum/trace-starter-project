'use strict'

//const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter')
const { NodeTracerProvider } = require('@opentelemetry/node')
const { BatchSpanProcessor } = require('@opentelemetry/tracing');
const { StackdriverTraceExporter } = require('@opentelemetry/exporter-stackdriver-trace')
 
const exporter = new StackdriverTraceExporter({'foodfinder'});

//const exporter = new TraceExporter({projectId: 'jonah-starter-project'})
const provider = new NodeTracerProvider()

provider.addSpanProcessor(new BatchSpanProcessor(exporter))
provider.register()

const express = require('express')
const request = require('request')

const PORT = 7500

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

app.listen(PORT, () => {console.log(`Running FoodFinder!`)})