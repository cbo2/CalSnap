require("dotenv").config({
    silent: true
});
const axios = require("axios")

console.log("key test: " + process.env.REACT_APP_NUTRITION_KEY)

const appKey = process.env.REACT_APP_NUTRITION_KEY
const appID = process.env.REACT_APP_NUTRITION_APP_ID
// const searchItem = "pineapple"
const searchBarcode = "0038622624472"

// References used:
// docs:      https://developer.nutritionix.com/docs/v1_1
// fields:    https://docs.google.com/spreadsheets/d/1jZSa039OfpQOiRzaS980nPKCvVe2TRKRPZk7ZbaH7kE/edit#gid=0
// jsontool:  http://jsonviewer.stack.hu




module.exports = {
    
    nutritionixInstantSearchDirect: function(searchTerm) {
        let returnVal = ""
        const fields = "?results=0%3A5" + // 5 items in the result
            "&cal_min=0&cal_max=50000" + // min and max calories
            "&fields=item_name%2Cnf_calories%2Cnf_protein%2Cnf_total_carbohydrate%2Cnf_serving_size_unit"
        const id = `&appId=${appID}`
        const key = `&appKey=${appKey}`
        axios.get(`https://api.nutritionix.com/v1_1/search/${searchTerm}${fields}${id}${key}`
        ).then(response => { 
            console.log(`got this from nutritionix: ${JSON.stringify(response.data)}`) 
            returnVal = response.data
        })
        .catch(err => { 
            console.log(`nutritionixInstantSearch:  got this error from nutritionix: ${err}`) 
            returnVal = "ERR-200: Bad response from Nutrionix"
        })
        return returnVal
    },
    nutritionixInstantSearch: function (req, res) {
        res.send(module.exports.nutritionixInstantSearchDirect(req.body.searchItem));
    },
    // Nutritionix call for item search
    // not working yet
    nutritionixNutritionSearch: function (req, response) {

        axios.post("https://trackapi.nutritionix.com/v2/natural/nutrients", {
            headers: {
                "x-app-id": appID,
                "x-app-key": appKey,
                "x-remote-user-id": "0",
                "Content-Type": "application/json"
            },
            body: {
                "query": "banana"
            }


        }).then(response => { console.log(`got this from nutritionix: ${JSON.stringify(response.data.common[0])}`) })

            .catch(err => { console.log(`nutritionixNutritionSearch:  got this error from nutritionix: ${err}`) })

    },

    // Nutritionix call for barcode scanning
    // *******Currently getting error TypeError: Converting circular structure to JSON.... need to fix**********
    nutritionixBarcode: function (req, response) {

        axios.get(`https://trackapi.nutritionix.com/v2/search/item?upc=${searchBarcode}`, {
            headers: {
                "x-app-id": appID,
                "x-app-key": appKey
            }


        }).then(response => { console.log(`got this from nutritionix.  Item is: ${response.data.foods[0].food_name} and calories are: ${response.data.foods[0].nf_calories}  ${JSON.stringify(response.data)}`) })

            .catch(err => { console.log(`nutritionixBarcode:  got this error from nutritionix: ${err}`) })

    }
}
