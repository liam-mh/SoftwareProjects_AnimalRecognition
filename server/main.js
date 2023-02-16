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

// landing
app.get('/', (req, res) => {
    res.render("index");
})
// upload image button
app.post('/upload', upload.single("image"), (req, res) => {
    console.log('image uploaded');
    res.redirect('/results');
})

// admin login 
app.get('/login', (req, res) => {
    res.render("admin-login");
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
    res.render("results", {images: imageData});

    writeToFile('currentSearch.json' ,imageData);
    // get user validation
    writeToFile('currentSearch.json', updatedImageData);
    //ds.save(); // save all 
});

// admin login 
app.get('/login', (req, res) => {
    res.render("admin-login");
})

const ds = require('./dataStore/dataStore.js');

// Define the formatDate function
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

// admin index
app.get('/admin', (req, res) => {
    const allData = ds.readJsonFileToArray('dataStore.json');
    if (allData) {console.log('Data loaded from store')};
    res.render("admin-index", {data: allData, formatDate: formatDate});
})

// port num for localhost
app.listen(8000) 


var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};

 
