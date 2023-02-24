// node path library
const path = require('path');

// express framework setup
const express = require('express');
const { dirname } = require('path');
const app = express();

// middleware for file locations
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/images', express.static(path.join(__dirname, 'dataStore', 'images')));


// built in express, looks at body of post requests
app.use(express.urlencoded({extended: true}))

// using the ejs templating engine 
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../client/views"));

// Multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, '../client/public/userImages');
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        console.log('Image uploaded:', file.originalname);
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage});

// dataStore methods
const ds = require('./dataStore/dataStore.js');

// -----------------
// ----- pages -----

// landing
app.get('/', (req, res) => {
    ds.clearFolder();
    res.render("index");
})
// upload image button
app.post('/upload', upload.single("image"), (req, res) => {
    res.redirect('/results');
})


// results
const cloud = require('./visionAPI/cloud.js')
const writeToFile = require('./dataStore/currentSearch.js');
app.get('/results', async (req, res) => { 
    try {
        const imageData = await cloud.getImageLabels();
        const animalInImage = await cloud.checkLabelsForAnimal(imageData[0].labels);
        await writeToFile('currentSearch.json' ,imageData);
        res.render("results", {images: imageData, animal: animalInImage });
        ds.save(); // save all 
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});


// ---------------

// Define the formatDate function
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

// admin login 
app.get('/login', (req, res) => {
    res.render("admin-login");
})

// admin index
app.get('/admin', (req, res) => {
    const allData = ds.readJsonFileToArray('dataStore.json');
    res.render("admin-index", {data: allData, formatDate: formatDate});
})

// port num for localhost
app.listen(8000) 

 
