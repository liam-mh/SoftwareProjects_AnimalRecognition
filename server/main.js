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

// Multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/client/public/userImages');
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage});

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
// upload image button
app.post('/upload', upload.single("image"), (req, res) => {
    console.log('image uploaded');
    res.redirect('/results');
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

 
