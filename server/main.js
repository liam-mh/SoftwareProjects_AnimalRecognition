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

// admin login test
app.get('/login', (req, res) => {
    res.render("admin-login");
})

// test landing
app.get('/test', (req, res) => {
    res.render("test");
})

// landing
app.get('/', (req, res) => {
    res.render("index");
})

// admin index
app.get('/admin', (req, res) => {
    res.render("admin-index");
})

// results
const getImageLabels = require('./visionAPI/cloud.js')
const writeToFile = require('./dataStore/currentSearch.js');
app.get('/results', async (req, res) => { 
    const imageData = await getImageLabels();
    writeToFile('currentSearch.json' ,imageData);
    res.render("results", {images: imageData});
});

// port num for localhost
app.listen(8000) 


var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};

 
