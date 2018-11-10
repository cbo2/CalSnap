import axios from "axios";

export default {
  // Gets all food for user
  getFoodsbyUser: function (params) {
    return axios.get(`/api/food/${params.username}`);
  },
  // Gets all food for user by date range
  getFoodsbyUserAndDateRange: function (params) {
    return axios.get(`/api/food/${params.username}/${params.today}/${params.tomorrow}/${params.meal}`)
  },
  getFoodbyId: function (id) {
    return axios.get(`/api/food/${id}`)
  },
  // Gets user
  getUser: function (params) {
    return axios.get(`/api/user/${params.username}`)
  },
  updateUser: function (id, user) {
    return axios.put(`/api/user/${id}`, user)
  },
  // Deletes the food with the given id
  deleteFood: function (id) {
    return axios.delete(`/api/food/${id}`);
  },
  // Deletes the foods related to username
  deleteFoodsbyUser: function (username) {
    return axios.delete(`/api/food/deleteallfoods/${username}`)
  },
  // Deletes the foods & profile related to username & deletes Auth0 profile
  deleteUser: function (username, id) {
    return axios.delete(`/api/user/${username}/${id}`)
  },
  // Saves a food to the database
  createFood: function (food) {
    return axios.post("/api/food/", food);
  },
  // Saves a new user to the database
  createUser: function (user) {
    return axios.post("/api/user", user);
  },
  updateFood: function (id, food) {
    return axios.put(`/api/food/${id}`, food)
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