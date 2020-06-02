'use strict'

import express from 'express'
import request from 'request'

// Constants
const PORT = 7500
const HOST = '127.0.0.1'

const queryAllVendors = async (vendors: string[], ingredient: string, res: any) => {
  const vendorsInfo: object[] = []
  // It is possible for the promises to resolve in different orders but the list will always be the same
  vendors.forEach( (vendor: string) => {
    const vendorOptions = {
      url: `http://${HOST}:${PORT + 2}/FoodVendor`,
      qs: {
        'vendorQuery': vendor,
        'ingredientQuery': ingredient
      }
    }
    vendorsInfo.push(new Promise((resolve: any, reject: any) => {
        request(vendorOptions, (err: object, response: object, vendorBody: object) => {
            resolve(vendorBody)
        })
    }))
  })
  Promise.all(vendorsInfo)
  .then((values: any) => {
      res.send(values)
  })
}

const foodFinder = async (req: any, res: object) => {
  const ingredient = req.query.ingredient
  const supplierOptions = {
    url: `http://${HOST}:${PORT + 1}/FoodSupplier`,
    qs: {
      'ingredientQuery': ingredient
    }
  }

  request(supplierOptions, (err: object, response: object, supplierBody:string) => {
    queryAllVendors(JSON.parse(supplierBody), ingredient, res)
  })
}


const app = express()

app.get('/FoodFinder', foodFinder)

app.listen(PORT, HOST)
// console.log(`Running on http://${HOST}:${PORT}/FoodFinder`)