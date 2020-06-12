const rp = require('request-promise')


const options = {
    // this is the link specific to the deployment service on GKE
    uri: 'http://35.231.32.155/FoodFinder',
    qs: {
        ingredient: 'flour'
    }
};

rp(options)
.then((res) => {
    const flourOptions = JSON.parse(res)
    let displayString = 'Flour\n-------\nPrice\tQuantity\tVendor\n'
    flourOptions.forEach((option) => {
        option = JSON.parse(option)
        displayString += `${option.price}\t${option.quantity}\t\t${option.vendorName}\n`
    })
    console.log(displayString, '\n')
})


options.qs.ingredient = 'sugar'
rp(options)
.then((res) => {
    const sugarOptions = JSON.parse(res)
    let displayString = 'Sugar\n-------\nPrice\tQuantity\tVendor\n'
    sugarOptions.forEach((option) => {
        option = JSON.parse(option)
        displayString += `${option.price}\t${option.quantity}\t\t${option.vendorName}\n`
    })
    console.log(displayString, '\n')
})


options.qs.ingredient = 'yeast'
rp(options)
.then((res) => {
    const sugarOptions = JSON.parse(res)
    let displayString = 'Yeast\n-------\nPrice\tQuantity\tVendor\n'
    sugarOptions.forEach((option) => {
        option = JSON.parse(option)
        displayString += `${option.price}\t${option.quantity}\t\t${option.vendorName}\n`
    })
    displayString += '\n'
    console.log(displayString)
})


options.qs.ingredient = 'not a real ingredient'
rp(options)
.then((res) => {
    console.log(`Error Checking\n-------\nAn ingredient query for an ingredient not in the 'database' will return - ${res}\n`)
})

options.qs.ingredient = ''
rp(options)
.then((res) => {
    console.log(`Error Checking\n-------\nProvidng an empty string as an ingredient (or no ingredient argument) will return - ${res}\n`)
})
