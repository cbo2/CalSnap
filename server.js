const express = require("express");
const bodyParser = require("body-parser");  
const routes = require("./routes");
const mongoose = require("mongoose");
const axios = require("axios");


let PORT = process.env.PORT || 3001;


// Initialize Express
let app = express();

// Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// axios used as a request
app.set('axios', axios);

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/caloriecount"
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Add routes, both API and view
app.use(routes);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

module.exports = app;