const express = require("express");
const bodyParser = require("body-parser");  
const routes = require("./routes");
const mongoose = require("mongoose");
const axios = require("axios");
// const socket = require("socket.io");


let PORT = process.env.PORT || 3001;


// Initialize Express
let app = express();

// Configure middleware
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb', extended: true}));
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

// Add routes, both API and view
app.use(routes);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ });
server.listen(4000);

// const io = socket(server);
io.on('connection', socket => {
    console.log(`***** made a connection with ${socket.id}`)
    socket.on('calpal', data => {
        console.log(`*** received this message [${data.handle}]: ${data.message}`)
        io.sockets.emit('calpal', data)  // emit now from server out to the clients!
    })
})


module.exports = app;