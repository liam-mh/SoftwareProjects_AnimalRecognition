// node path library
const path = require('path');

// express framework setup
const express = require('express');
const { dirname } = require('path');
const app = express();

// middleware for file locations
app.use(express.static('../client/public'));

// built in express, looks at body of post requests
app.use(express.urlencoded({extended: false}))

// using the ejs templating engine 
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../client/views"));


// -----------------
// ----- pages -----

// admin login test

app.get('/login', (req, res) => {
    res.render("admin-login");
})


// landing
app.get('/', (req, res) => {
    res.render("index");
})

// end landing

// results

const userImagePath = path.join(__dirname, "../client/public/userImages/");

async function getUserImages() {
    const fs = require("fs");
    var userImages = [];

    const readDirectory = new Promise((resolve, reject) => {
        fs.readdir(userImagePath, (err, files) => {
            if (err) reject(err);
            files.forEach(file => {
                userImages.push({
                    path: file, 
                    labels: []
                });
            });
            resolve();
        });
    });
    await readDirectory;

    const client = require('./visionAPI/cloud.js');

    for (let image of userImages) {
        const [result] = await client.labelDetection(path.join(userImagePath, image.path));
        image.labels = result.labelAnnotations;
    };

    module.exports = userImages;
    return userImages;
}

app.get('/results', async (req, res) => { 

    const userImages = await getUserImages();
    // Passes data to ejs page
    res.render("results", {images: userImages});
    console.log(userImages);
});

// end results


// port num for localhost
app.listen(8000) 
 
