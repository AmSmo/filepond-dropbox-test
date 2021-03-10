const express = require("express");
const keys = require('./keys');
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");
const multer = require('multer');
const cors = require("cors");

// Takes a file upload and stores the original file in temporary folder on Heroku.

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp/');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

// Filters file type and sends back a message if there's an error.

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            req.error = 'Only .png, .jpg and .jpeg allowed';
            return cb(null, false, new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// Initializes express instance, and cors is to test on local environment with React on port 3000
const app = express()
app.use(
    cors({
        origin: "http://localhost:3000"
    })
);


app.post('/upload', upload.any(), async (req, res) => {
    // Catch any unforseen errors
    if (req.error) {
        return res.json({ errors: req.error })
    }

    // Get path of the file and also double check filetype
    let { path } = req.files[0]
    let filetype = req.files[0].mimetype.split("/")[1]

    // Keys is a .gitignored file that has Dropbox token for specific file folder

    const dropbox = dropboxV2Api.authenticate({
        token: keys.DROPBOX
    });

    // Used for file storage information, folder was the date of the show and user was the uploader

    let { folder, user } = req.body

    // Establishes the path on the dropbox end, renames the file from temporary storage.

    const params = Object.freeze({
        resource: 'files/upload',
        parameters: {
            path: `/${folder}/${user}.${filetype}`
        },
        readStream: fs.createReadStream(path)
    });

    // Either successfully uploads or meets an error

    let dropboxUpload = new Promise(function (resolve, reject) {
        dropbox(params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    // Checks that the upload can resolve from dropbox and returns appropriate message
    // Logs information as to location of file.

    try {
        let resultObj = await dropboxUpload
        console.log(`File upload Succeeded, Can be found at ${resultObj.path_display}`)
        return res.json({ success: "File can be found on dropbox!" })
    } catch (err) {
        console.log(err)
        return res.json({ errors: err })
    }
});


// Since this was a proof of concept, did not take environmental port variable 
// from Heroku, and just set to 4000

app.listen(5000, () => {
    console.log(`Server successfully created on Port: 5000`);
});