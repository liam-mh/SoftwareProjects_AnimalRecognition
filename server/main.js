// node path library
const path = require('path');

// express framework setup
const express = require('express');
const { dirname } = require('path');
const app = express();

// middleware for file locations
app.use(express.static('../client/public'));

// built in express, looks at body of post requests
app.use(express.urlencoded({extended: true}))

// using the ejs templating engine 
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../client/views"));


// -----------------
// ----- pages -----

// landing
app.get('/', (req, res) => {
    res.render("index");
})

// results
const getImageLabels = require('./visionAPI/cloud.js')
const addData = require('./dataStore/currentSearch.js');
app.get('/results', async (req, res) => { 
    const userImages = await getImageLabels();
    addData(userImages);
    res.render("results", {images: userImages});
});

// port num for localhost
app.listen(8000) 
 
