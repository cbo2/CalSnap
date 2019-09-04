const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const mongoose = require("mongoose");
const axios = require("axios");
const AuthenticationClient = require('auth0').AuthenticationClient;

const auth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENTID,
    clientSecret: process.env.AUTH0_CLIENTSECRET
});

let PORT = process.env.PORT || 3001;

// Initialize Express
let app = express();

// Configure middleware
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(express.json());

// axios used as a request
app.set('axios', axios);

// Use body-parser for handling form submissions
// TODO - remove later --> app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/CalSnap"
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Get Auth0 Management API Token
auth0.clientCredentialsGrant(
    {
        audience: `https://${process.env.AUTH0_TENANT}.auth0.com/api/v2/`,
        scope: 'delete:users'
    },
    function (err, response) {
        if (err) {
            console.log(err);
        }
        process.env['AUHT0_API_TOKENID'] = response.access_token
        console.log(response.access_token);
    }
);

// Add routes, both API and view
app.use(routes);

const BASE_URL = process.env.BASE_URL|| "http://localhost:" + PORT

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");

    // keep app alive on heroku -- since heroku sleeps all apps with 1 hour of inactivity!
    var https = require("https");
    setInterval(function () {
        console.log(`pinging ourselves now on: ${BASE_URL}`)
        https.get(BASE_URL);
    }, 300000); // every 5 minutes (300000)
});

module.exports = app;