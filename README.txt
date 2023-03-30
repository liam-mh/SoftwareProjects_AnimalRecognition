Animal Recognition Prototype
Professional Software Projects - Elanco Group 3

Liam Hammond
James Pham
Sami Haq
Mohammed Ramdan

Version: 0.4.0
March 2023

------------------
1.  INTRODUCTION
------------------

Elanco Animal Health is a leading global animal health company dedicated to 
delivering innovative products and services to prevent and treat disease in pets and livestock. 
With a rich history dating back to its establishment as a subsidiary of Eli Lilly and Company, 
Elanco has emerged as the third-largest animal health company in the world.

Project Summary:
Elanco is committed to exploring new ways of improving its product range, and to that end, 
it is interested in leveraging cloud-based cognitive services for image analysis on photos of animals. 
The company aims to create a service that recognizes certain animal groups, which it cannot offer today. 
To achieve this goal, Elanco has partnered with us to build a web-based prototype using Google Cloud Vision AI. 
The prototype will use image recognition to display key details from animal images 
and extract useful data to validate this approach to enhance customer experience.

Task:
As part of this project, we will build a web-based prototype that demonstrates the use of image recognition 
to display key details from animal images. Elanco will provide sample images, 
and we will use Google Cloud Vision AI to extract useful data from these images. 
The prototype will be accessible through a web interface, 
allowing Elanco to visualize the data and validate the feasibility of this approach to enhancing its customer experience.

------------------
2. DEPENDENCIES
------------------

(a) Google Cloud Vision API: ^3.1.0
A powerful image analysis tool that uses machine learning models to identify objects and labels within images. 
It is used in this project to scan user-uploaded images and return object and label data for storage and analysis. 
More information about the API can be found at: https://cloud.google.com/vision/docs/libraries

(b) Embedded JavaScript Template: "^3.1.8"
A lightweight templating engine that allows dynamic HTML page rendering. 
This is used in the project to render HTML pages with dynamic content. 
More information about EJS can be found at: https://ejs.co

(c) Node.js: ^18.13.0
A JavaScript runtime built on the Chrome V8 JavaScript engine. 
It provides an efficient and scalable platform for server-side JavaScript applications. 
Node.js is used in this project to run the web server and handle requests. 
More information about Node.js can be found at: https://nodejs.org/en/

(d) Express.js: ^4.18.2
A popular Node.js framework used for building web applications. 
It provides a set of features and tools for creating robust APIs and web servers. 
Express.js is used in this project to handle HTTP requests and route traffic to the appropriate endpoints. 
More information about Express.js can be found at: https://expressjs.com

(e) Universally Unique Identifiers: ^9.0.0
A package used to generate UUIDs (Universally Unique Identifiers) which are used to uniquely identify database entries. 
This is used in the project to generate unique IDs for database entries. 
More information about UUIDs can be found at: https://www.npmjs.com/package/uuid

(f) Multer: ^1.4.5-lts.1
A middleware for handling file uploads in Node.js. 
It makes it easy to handle file uploads, validate file types, and store files on disk or in cloud storage. 
Multer is used in this project to handle user-uploaded images. 
More information about Multer can be found at: https://www.npmjs.com/package/multer

(g) Canvas: ^2.11.0
A package used for rendering images on the server-side in Node.js. 
It provides a simple and powerful API for drawing graphics and manipulating images. 
Canvas is used in this project to draw rectangles and labels over uploaded images. 
More information about Canvas can be found at: https://www.npmjs.com/package/canvas

(h) Sharp: ^0.31.3
A high-performance image processing library for Node.js. 
It provides a simple and fast API for resizing, cropping, and converting images. 
Sharp is used in this project to resize and optimize user-uploaded images for storage. 
More information about Sharp can be found at: https://www.npmjs.com/package/sharp

(i) Sobel: ^0.0.11
Sobel is a small library used to perform edge detection on images. 
It is used in this project to detect the edges of the input image to better identify the quantity of animals. 
Sobel uses the Sobel operator to calculate the gradient of an image, 
which can be used to identify the edges of objects within the image. 
The library is available on GitHub at https://github.com/miguelmota/sobel.

(j) Firebase: ^9.17.2
A comprehensive suite of services for building web and mobile applications. 
It provides a cloud-based backend platform with a variety of services, including real-time databases, authentication, 
hosting, and more. Firebase is used in this project to store user-uploaded images and object/label data in real-time. 
More information about Firebase can be found at: https://firebase.google.com

(k) Firebase Admin: ^11.5.0
A library that allows server-side access to Firebase services. 
Firebase Admin is used in this project to authenticate admin users and provide access to the Firebase real-time database. 
More information about Firebase Admin can be found at: https://www.npmjs.com/package/firebase-admin

------------------
3.  INSTALLATION
------------------
Running this project locally:

(1) Clone the github repository locally, or open the .zip file

(2) Open in desired IDE, this demonstration is for Visual Studio Code

(3) Create / have a Google Cloud account https://cloud.google.com/vision
    
(4) Setup and generate a key, save this as key.json and place it in the directory folder.

(5) Create / have a Google Firebase account https://firebase.google.com
    
(6) Setup and generate a key, save this as firebaseKey.json and place it in the directory folder.

(7) Run 'npm install' in your bash / command line

(8) Run 'node server/main' in your bash / command line

(9) On a web browser enter 'http://localhost:8000'

------------------
4.  USAGE
------------------

User:
Upload the image you want to analyze by clicking on the "Choose File" button.
Once you have selected an image, click on the "Scan" button to initiate the image analysis process.
The app uses the Google Cloud Vision API to scan the image and return labels and object data.
After the analysis is completed, you will see a summary of the results, including the labels that have been detected for your image.
The results also display potential hazards amongst animals in its comparison lists.
You can validate the labels if you think they are accurate or related to the animal by toggling the ✅ / ❌ button.
The analyzed image will be stored in Firebase Storage for future reference.

Elanco Admin:
Admins can login and access the full database in a clean and formatted table.
They can view each search, the image, the image with object boxes, and the label results and if the user has validated them.
In addition to filtering the data and viewing graphs with data contents quantity.
The admin can also view a log of all errors to help maintain system health.
In addition to viewing all of the users invalidations, to see if any patterns emerge.

------------------
5.  DOCUMENTATION
------------------

This application is made by Liam, James, Sami, Mohammad, and should only be used and/or distributed
by those authorised by themselves, Elanco, or Sheffield Hallam University.

Elanco : https://www.elanco.com/en-us
Sheffield Hallam University: https://www.shu.ac.uk/myhallam

------------------
6.  SUPPORT
------------------

Following and further issues, please go through this readme file again, 
if the program still does not function, get in touch with any of the authors directly.
