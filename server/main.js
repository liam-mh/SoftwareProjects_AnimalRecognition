// express framework setup
const path = require('path');
const express = require('express');
const { dirname } = require('path');
const app = express();
app.use(express.urlencoded({extended: true}))

// middleware for file locations
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/images', express.static(path.join(__dirname, 'dataStore', 'images')));

// using the ejs templating engine 
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../client/views"));

// Multer (user image upload)
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

// Other file functions
const cs = require('./dataStore/currentSearch.js'); // currentSearch
const ds = require('./dataStore/dataStore.js');     // dataStore
const cloud = require('./visionAPI/cloud.js');      // Cloud vision api
const fb = require('./dataStore/firebase.js');      // Firebase 
// Define the formatDate function
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
};


/**
 * User Pages
 */

// landing
app.get('/', (req, res) => {
    console.log("----------- Index");
    ds.clearFolder();
    res.render("index");
});

// upload image button
app.post('/upload', upload.single("image"), (req, res) => {
    res.redirect('/results');
});

// results
app.get('/results', async (req, res) => { 
    console.log("----------- Results");
    try {
        const imageData = await cloud.scan();
        res.render("results", { images: imageData });
        await cs.saveInJSON('currentSearch.json' ,imageData);
        fb.saveCurrentSearchToFirebase();
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});

/**
 * Admin Pages
 */

// admin login 
app.get('/login', (req, res) => {
    console.log("----------- Login")
    res.render("admin-login");
});

//  admin index
app.get('/admin', async (req, res) => {
    console.log("----------- Admin-Index")
    try {
        const allData = await fb.readAllFirebaseData();
        // Most common animal chart data
        const animalFrequencyArray = ds.getMostCommonAnimal(allData);
        const label = animalFrequencyArray.map(obj => obj.label);
        const frequency = animalFrequencyArray.map(obj => obj.frequency);
        
        res.render("admin-index", {
            data: allData, 
            formatDate: formatDate,
            label: label,
            frequency: frequency
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving data from Firebase");
    }
});

// port num for localhost
app.listen(8000); 

 