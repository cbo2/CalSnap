require("dotenv").config({
    silent: true
});
const axios = require("axios")

console.log("key test: " + process.env.REACT_APP_NUTRITION_KEY)

const appKey = process.env.REACT_APP_NUTRITION_KEY
const appID = process.env.REACT_APP_NUTRITION_APP_ID

module.exports = {
    nutritionixInstantSearch: function (req, res) {

        // const searchItem = "pineapple"
        axios.get("https://trackapi.nutritionix.com/v2/search/instant?query=" + res, {
            headers: {
                "x-app-id": appID,
                "x-app-key": appKey,
            }


        }).then(response => { console.log(`got this from nutrionix: ${JSON.stringify(response.data.common[0])}`) })

            .catch(err => { console.log(`got this error from nutrionix: ${err}`) })

    },


    // Nutritionix call for item search
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


        }).then(response => { console.log(`got this from nutrionix: ${JSON.stringify(response.data.common[0])}`) })

            .catch(err => { console.log(`got this error from nutrionix: ${err}`) })

    },

    // Nutritionix call for barcode scanning
    nutritionixBarcode: function (response) {

        axios.get("https://trackapi.nutritionix.com/v2/search/item?nix_item_id=513fc9e73fe3ffd40300109f", {
            headers: {
                "x-app-id": appID,
                "x-app-key": appKey
            }


        }).then(response => { console.log(`got this from nutrionix: ${JSON.stringify(response)}`) })

            .catch(err => { console.log(`got this error from nutrionix: ${err}`) })

    }

};