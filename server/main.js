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

// current search method
const cs = require('./dataStore/currentSearch.js');
// dataStore methods
const ds = require('./dataStore/dataStore.js');
// cloud API methods
const cloud = require('./visionAPI/cloud.js');
// firebase methods
const fb = require('./dataStore/firebase.js');


// ---------------------------------------------------
// ----- pages ---------------------------------------

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

        res.render("results", {
            images: imageData
        });

        await cs.writeToFile('currentSearch.json' ,imageData);
        fb.saveCurrentSearchToFirebase();

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
};

// admin login 
app.get('/login', (req, res) => {
    console.log("----------- Login")
    res.render("admin-login");
});

//  admin index
app.get('/admin', (req, res) => {
    console.log("----------- Admin-Index")

    const allData = ds.readJsonFileToArray('dataStore.json');
    const animalFrequencyArray = ds.getMostCommonAnimal();
    const label = animalFrequencyArray.map(obj => obj.label);
    const frequency = animalFrequencyArray.map(obj => obj.frequency);

    res.render("admin-index", {
        data: allData, 
        formatDate: formatDate,
        label: label,
        frequency: frequency
    });
});

app.get('/test', async (req, res) => {
    try {
        const allData = await fb.readAllFirebaseData();
        const animalFrequencyArray = ds.getMostCommonAnimal();
        const label = animalFrequencyArray.map(obj => obj.label);
        const frequency = animalFrequencyArray.map(obj => obj.frequency);
        console.log(allData);
        res.render("test", {
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

app.get('/table', (req, res) => {
    const data = [
        { id: 1, value: true },
        { id: 2, value: false },
        { id: 3, value: true },
        { id: 4, value: false },
        { id: 5, value: true }
    ];

    res.send(`
      <html>
        <head>
          <title>Table with Filtering</title>
        </head>
        <body>
          <button id="toggle-btn">Toggle Filter</button>
          <table id="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item, index) => `
                <tr class="data-row ${item.value ? 'show' : 'hide'}" data-index="${index}">
                  <td>${item.id}</td>
                  <td>${item.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            const btn = document.querySelector('#toggle-btn');
            const rows = document.querySelectorAll('.data-row');
            let showValue = true;
  
            function toggleFilter() {
              showValue = !showValue;
              rows.forEach(row => {
                if (row.querySelector('td:nth-child(2)').textContent === 'true' && showValue) {
                  row.classList.remove('hide');
                  row.classList.add('show');
                } else if (row.querySelector('td:nth-child(2)').textContent === 'false' && !showValue) {
                  row.classList.remove('hide');
                  row.classList.add('show');
                } else {
                  row.classList.remove('show');
                  row.classList.add('hide');
                }
              });
            }
  
            btn.addEventListener('click', toggleFilter);
          </script>
        </body>
      </html>
    `);
  });

// port num for localhost
app.listen(8000); 

 