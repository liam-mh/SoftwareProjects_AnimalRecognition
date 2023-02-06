// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
    
// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: "key.json"
});    

// Export validated client
module.exports = client;

