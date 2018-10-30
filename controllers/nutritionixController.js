require("dotenv").config({
    silent: true
});
const axios = require("axios")

console.log("key test: " + process.env.REACT_APP_NUTRITION_KEY)

const appKey = process.env.REACT_APP_NUTRITION_KEY
const appID = process.env.REACT_APP_NUTRITION_APP_ID
const searchItem = "pineapple"
const searchBarcode ="0038622624472"

module.exports = {
    nutritionixInstantSearch: function (req, res) {

        
        axios.get("https://trackapi.nutritionix.com/v2/search/instant?query=" + searchItem, {
            headers: {
                "x-app-id": appID,
                "x-app-key": appKey,
            }


        }).then(response => { console.log(`got this from nutritionix: ${JSON.stringify(response.data.common[0])}`) })

            .catch(err => { console.log(`got this error from nutritionix: ${err}`) })

    },


    // Nutritionix call for item search
    // not working yet
    nutritionixNutritionSearch: function (response) {

        axios.get("https://trackapi.nutritionix.com/v2/natural/nutrients", {
            headers: {
                "x-app-id": appID,
                "x-app-key": appKey,
                "x-remote-user-id": "0"
            },
            body: {
                "query": "1 cup chicken noodle soup",
            }


        }).then(response => { console.log(`got this from nutritionix: ${JSON.stringify(response.data.common[0])}`) })

            .catch(err => { console.log(`got this error from nutritionix: ${err}`) })

    },

    // Nutritionix call for barcode scanning
    // *******Currently getting error TypeError: Converting circular structure to JSON.... need to fix**********
    nutritionixBarcode: function (response) {

        axios.get("https://trackapi.nutritionix.com/v2/search/item?upc=" + searchBarcode, {
            headers: {
                "x-app-id": appID,
                "x-app-key": appKey
            }


        }).then(response => { console.log(`got this from nutritionix: ${JSON.stringify(response)}`) })

            .catch(err => { console.log(`got this error from nutritionix: ${err}`) })

    }

};