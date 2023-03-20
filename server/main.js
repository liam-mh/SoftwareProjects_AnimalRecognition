const cs = require('./dataStore/currentSearch.js'); 
const ds = require('./dataStore/dataStore.js');     
const { scanImages } = require('./visionAPI/cloud.js');   
const { saveCurrentSearchToFirebase, readFirebaseData } = require('./dataStore/firebase.js');      
const { handleError } = require('./errorHandling');
const { app, upload, formatDate } = require('./config');

/**
 * User Pages
 * ==============================================================================================
 */

let imageData = [];

// landing
app.get('/', (req, res) => {
    console.log("----------- Index");
    try {
        ds.clearFolder();
        res.render("index");
    } catch (error) {
        handleError(error, req, res);
    }
});

// upload image button
app.post('/upload', upload.single("image"), async (req, res) => {
    try {
        console.log("----------- Upload");
        res.locals.image = req.file;
        res.render("upload"); 
        imageData = await scanImages();
    } catch (error) {
        handleError(error, req, res);
    }
});

// results
app.get('/results', async (req, res) => { 
    console.log("----------- Results");
    try {
        res.render("results", { images: imageData });
        await cs.saveInJSON('currentSearch.json' ,imageData);
        saveCurrentSearchToFirebase();
    } catch (error) {
        handleError(error, req, res);
    }
});

/**
 * Admin Pages
 * ==============================================================================================
 */

// admin login 
app.get('/login', (req, res) => {
    console.log("----------- Login")
    res.render("admin-login");
});

// admin index
app.get('/admin', async (req, res) => {
    console.log("----------- Admin-Index")
    try {
        const data = await readFirebaseData('labelData');
        // Most common animal chart data
        const animalFrequencyArray = ds.getMostCommonAnimal(data);
        const label = animalFrequencyArray.map(obj => obj.label);
        const frequency = animalFrequencyArray.map(obj => obj.frequency);
        
        res.render("admin-index", {
            data: data, 
            formatDate: formatDate,
            label: label,
            frequency: frequency
        });
    } catch (error) {
        handleError(error, req, res);
    }
});

// admin logs
app.get('/admin-logs', async (req, res) => {
    console.log("----------- Admin-Logs")
    try {
        const data = await readFirebaseData('errorLogs');
        res.render("admin-logs", {
            data: data, 
            formatDate: formatDate
        });
    } catch (error) {
        handleError(error, req, res);
    }
});

// error test page
app.get('/testError', (req, res) => {
    try {
        throw new Error("test error"); 
    } catch (error) {
        handleError(error, req, res);
    }
});
app.get('/test', (req, res) => {
    res.render("test");
});

/**
 * port num for localhost
 */
app.listen(8000); 

 