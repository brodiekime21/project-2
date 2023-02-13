// Required modules
const http = require('http');
const util = require('util');

// https://github.com/node-formidable/node-formidable
const Formidable = require('formidable');

//https://www.npmjs.com/package/dotenv
const cloudinary = require("cloudinary");
require('dotenv').config()

// Cloudinary configuration settings
// This will be fetched from the .env file in the root directory
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//Create a server
http.createServer((req, res) => {
    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {

        // parse a file upload
        const form = new Formidable();

        form.parse(req, (err, fields, files) => {

            // Find Cloudinary documentation using the link below
            // https://cloudinary.com/documentation/upload_images
            cloudinary.uploader.upload(files.upload.path, result => {

                // This will return the output after the code is exercuted both in the terminal and web browser
                // When successful, the output will consist of the metadata of the uploaded file one after the other. These include the name, type, size and many more.
                console.log(result)
                if (result.public_id) {
                
                // The results in the web browser will be returned inform of plain text formart. We shall use the util that we required at the top of this code to do this.
                    res.writeHead(200, { 'content-type': 'text/plain' });
                    res.write('received uploads:\n\n');
                    res.end(util.inspect({ fields: fields, files: files }));
                }
            });
        });
        return;
    }
    // show a file upload form
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
            <!doctype html>
            <html lang="en">

            <head>
                <title>CLOUDINARY UPLOADER</title>
                <!-- Required meta tags -->
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

                <!-- Bootstrap CSS -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

                <!-- Custom CSS -->
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
                    * {
                        font-family: Montserrat;
                    }
                </style>
                </head>

            <body>

             <!-- Optional JavaScript -->
              <!-- jQuery first, then Popper.js, then Bootstrap JS -->
             <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
             <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
             <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

             <!-- Main Container -->
             <div class="container">

                    <!-- Header -->
                    <br>
                    <h1 class="text-center">CLOUDINARY UPLOADER</h1>
                   <hr>
                    <p class="text-secondary">This is a simple image uploader system!</p>
                   <hr>
                    <!-- Header end.//-->

                   <!-- Form-->
                   <form action="/upload" enctype="multipart/form-data" method="post">

                         <div class="form-group">
                              <label for="upload-image-file"></label>
                              <input type="file" class="form-control-file" name="upload" id="upload" placeholder="upload-image-file" aria-describedby="fileHelpId">
                              <small id="fileHelpId" class="form-text text-muted">Please select the image to be uploaded...</small>
                          </div>

                         <button type="submit" class="btn btn-primary" value="Upload">Upload</button>

                  </form>
                  <!-- Form end.//-->
                </div>
             <!--container end.//-->
            </body>

        </html>
  `);
    // Port number
}).listen(4000);