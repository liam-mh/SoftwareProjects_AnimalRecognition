const { saveToCurrentSearch, updateUserValidation } = require('./dataStore/currentSearch.js'); 
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
        const labelsUpdated = req.query.labelsUpdated === 'true';
        res.render("results", { images: imageData, labelsUpdated });
        await saveToCurrentSearch(imageData);
        saveCurrentSearchToFirebase();
    } catch (error) {
        handleError(error, req, res);
    }
});

// return updated user labels
app.post('/userLabels', async (req, res) => {
    try {
        res.redirect('/results?labelsUpdated=true');
        const labelsUserThinksInvalid = JSON.parse(req.body.labelsUserThinksInvalid);
        updateUserValidation(imageData, labelsUserThinksInvalid);
        saveToCurrentSearch(imageData);
        saveCurrentSearchToFirebase();
    } catch (error) {
        handleError(error, req, res);
    }
});

/**
 * Admin Pages
 * ==============================================================================================
 */

let data = [];

// admin login 
app.get('/login', (req, res) => {
    console.log("----------- Login")
    res.render("admin-login");
});

// admin index
app.get('/admin', async (req, res) => {
    console.log("----------- Admin-Index")
    try {
        data = await readFirebaseData('labelData');
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
        const errors = await readFirebaseData('errorLogs');
        const invalidLabels = ds.getUserInvalidation(data);
        res.render("admin-logs", {
            invalidations: invalidLabels,
            errors: errors, 
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

/**
 * port num for localhost
 */
app.listen(8000); 

 