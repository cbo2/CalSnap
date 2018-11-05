import axios from "axios";

export default {
  // Gets all food for user
  getFoodsbyUser: function (params) {
    console.log(JSON.stringify(params));
    return axios.get(`/api/food/${params.username}`);
  },
  // getFoodsbyUserAndDate: function (params) {
  //   console.log(`This is params for getFoodsbyUsernameAndDate: ${JSON.stringify(params)}`);
  //   return axios.get(`/api/user/${params.username}/${params.bYYYY}/${params.bMM}/${params.bDD}/${params.eYYYY}/${params.eMM}/${params.eDD}`)
  // },
  // Gets user
  getUser: function (params) {
    return axios.get(`/api/user/${params.username}`)
  },
  // Deletes the food with the given id
  deleteFood: function (id) {
    return axios.delete(`/api/food/${id}`);
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