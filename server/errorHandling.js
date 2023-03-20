/**
 * Error Handling
 * Contains methods for the express system to use
 * Logs all errors to firebase under '/errorLogs'
 */

const fb = require('./dataStore/firebase.js'); 

function logError(error, req, res) {
    const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stackTrace: error.stack,
        request: {
            url: req.url,
            headers: req.headers,
            body: req.body
        },
        response: {
            status: res.statusCode,
            data: res.data || {}
        },
        systemInfo: {
            os: process.platform,
            nodeVersion: process.version
        }
    };
    fb.saveErrorToFirebase(errorLog);
}

function handleError(error, req, res) {
    console.error('***** System Error:', error.message, '*****');
    logError(error, req, res);
    res.status(500).render("error");
};

module.exports = {
    handleError
}