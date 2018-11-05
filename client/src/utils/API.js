import axios from "axios";

export default {
  // Gets all food for user
  getSavedFoods: function (params) {
    return axios.get("/api/food/" + params.username);
  },
  // Gets user
  getUser: function (params) {
    return axios.get("/api/user/" + params.username)
  },
  // Deletes the food with the given id
  deleteFood: function (id) {
    return axios.delete("/api/food/" + id);
  },
  // Saves a food to the database
  createFood: function (food) {
    return axios.post("/api/food/", food);
  },
  // Saves a new user to the database
  createUser: function (user) {
    return axios.post("/api/user", user);
  },
  callImageRecognition: (image) => {
    return axios.post("/api/food/identify", { image: image })
  },
  nutritionixInstantSearch: (searchItem) => {
    return axios.post("api/food/nutritionix/instant", { searchItem: searchItem })
  },
  nutritionixBarcodeSearch: () => {
    return axios.post("api/food/nutritionix/barcode")
  },
  nutritionixNutritionSearch: () => {
    return axios.post("api/food/nutritionix/nutrition")
  },
  callScanBarcode: (image) => {
    return axios.post("/api/food/scanBarcode", { image: image })
  }
};