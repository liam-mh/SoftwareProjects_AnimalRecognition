const express = require('express')
const app = express()
const path = require('path');
const { getgroups } = require('process');
app.use('/public/images/', express.static('./public/images'));

//middleware - global
//built in express, looks at body of post requests
app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, "public")))

//using the ejs templating engine 
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// index
app.get('/', (req, res) => {
    res.render("index");
})


app.post("/result", (req, res) => {
    if (req.body.colour.trim().toUpperCase() === "BLUE") {
        res.send("Correct colour")
    } else {
        res.send("Incorrect colour, try again")
    }
})

//send raw json
app.get('/api/pets', (req, res) => {
    res.json([
        {name: "Pongo", animal: "dog"}, 
        {name: "Remy", animal: "dog"}
    ])
})




async function getUserImages() {
    const fs = require("fs");
    var userImages = [];

    const readDirectory = new Promise((resolve, reject) => {
        fs.readdir("./public/images", (err, files) => {
            if (err) reject(err);
            files.forEach(file => {
                userImages.push({
                    path: `public/images/${file}`, 
                    labels: []
                });
            });
            resolve();
        });
    });
    await readDirectory;

    const client = require('./cloud.js');

    for (let image of userImages) {
        const [result] = await client.labelDetection(image.path);
        image.labels = result.labelAnnotations;
    };

    return userImages;
}


app.get('/results', async (req, res) => { 

    const userImages = await getUserImages();
    // Passes data to ejs page
    res.render("results", {images: userImages});
    console.log(userImages);
});


//port num
app.listen(8000) 
 
