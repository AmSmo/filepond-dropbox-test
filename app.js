const express = require("express");
const keys = require('./keys');
const fs = require("fs");
const dropboxV2Api = require("dropbox-v2-api");
const multer = require('multer');
const cors = require("cors");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp/');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

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


const app = express()
app.use(
    cors({
        origin: "http://localhost:3000"
    })
);
app.get("/", (req, res) => {
    res.send("potato")
})

app.post('/upload', upload.any(), (req, res) => {
    if (req.error) {
        return res.json({ errors: req.error })
    }
    let { path } = req.files[0]
    let filetype = req.files[0].mimetype.split("/")[1]

    let { folder, user } = req.body
    const dropbox = dropboxV2Api.authenticate({
        token: keys.DROPBOX
    });
    const params = Object.freeze({
        resource: 'files/upload',
        parameters: {
            path: `/${folder}/${user}.${filetype}`
        },
        readStream: fs.createReadStream(path)
    });
    let dropboxPromise = new Promise(function (resolve, reject) {
        dropbox(params, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    dropboxPromise.then(function (resultObj) {
        console.log("fileUpload_OK")
        return res.json({ success: "Your file has been successfully added." })
    }).catch(function (err) {
        console.log(err)
        return res.json({ errors: err })
    });


})


app.listen(5000, () => {
    console.log(`Server successfully created on Port: 5000`);
});