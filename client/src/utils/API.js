import axios from "axios";

export default {
  // Gets all Articles
  getSavedFood: function () {
    return axios.get("/api/food");
  },
  // Gets the article with the given id
  getFood: function (id) {
    return axios.get("/api/food/" + id);
  },
  // Deletes the article with the given id
  deleteFood: function (id) {
    return axios.delete("/api/food/" + id);
  },
  // Saves a article to the database
  saveFood: function (food) {
    return axios.post("/api/food", food);
  },
  callImageRecognition: (image) => {
    return axios.post("/api/food/identify", { image: image })
  },
  nutritionixInstantSearch: (searchItem) => {
    return axios.post("api/food/nutritionix/instant", searchItem)
  
  },
  nutritionixBarcodeSearch: () => {
    return axios.post("api/food/nutritionix/barcode")
  
  },
  callScanBarcode: (image) => {
    return axios.post("/api/food/scanBarcode", { image: image })
  }
};