Animal Recognition Prototype
Professional Software Projects - Elanco Group 3

Liam Hammond
James Pham
Sami Haq
Mohammed Ramdan

Version: 0.2
March 2023

------------------
1.  INTRODUCTION
------------------
This prototype is a web application for our client Elanco. 
It takes a user input image and uses the Google Cloud Vision API to scan the image and return labels and object data. 
We then manage the data for a back end service, and display refactored data to the web user.
It can highlight objects and potential hazards.

------------------
2.  DOCUMENTATION
------------------
This application is made by Liam, James, Sami, Mohammad, and should only be used and/or distributed
by those authorised by themselves, Elanco, or Sheffield Hallam University.

------------------
3. DEPENDENCIES
------------------
This web application has the following dependencies:

(a) Google cloud Vision API: ^3.1.0
    https://cloud.google.com/vision/docs/libraries
    
(b) Embedded JavaScript Template: "^3.1.8"
    https://ejs.co

(c) Node.js: ^18.13.0
    https://nodejs.org/en/

(d) Express.js: ^4.18.2
    https://expressjs.com

(e) Universally Unique Identifiers: ^9.0.0
    https://www.npmjs.com/package/uuid

(f) Multer: ^1.4.5-lts.1
    https://www.npmjs.com/package/multer

(g) Canvas: ^2.11.0
    https://www.npmjs.com/package/canvas

(h) Sharp: ^0.31.3
    https://www.npmjs.com/package/sharp
  
------------------
4.  RUNNNING
------------------
Runing this project locally:

(1) Clone the github repository locally, or open the .zip file

(2) Open in desired IDE, this demonstration is for Visual Studio Code

(3) Create / have a google cloud account https://cloud.google.com/vision
    
(4) Setup and generate a key, save this as key.json and place it in the directory folder.

(5) Run 'npm install' in your bash / command line

(6) Run 'node server/main' in your bash / command line

(7) On a web browser enter 'http://localhost:8000'

------------------
5.  SUPPORT
------------------
Following and further issues, please go through this readme file again, 
if the program still does not function, get in touch with any of the authors directly.