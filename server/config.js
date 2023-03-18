/**
 * This code sets up the basic configuration for the express app and multer middleware for image upload.
 * It also exports the app, upload, and formatDate functions for use in 'main.js'
 */

// Import necessary modules
const path = require('path');
const express = require('express');
const multer = require('multer');

// Set up Express app
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/images', express.static(path.join(__dirname, 'dataStore', 'images')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views'));

// Set up Multer for image uploads
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

// Define formatDate function
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Export necessary variables and functions
module.exports = {
    app,
    upload,
    formatDate,
};
