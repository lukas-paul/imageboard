const express = require("express");
const app = express();
const db = require("./db.js");
const s3 = require("./s3.js");

app.use(express.static("./public"));

app.use(express.json());

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    //add image to the database
    console.log("req.body ", req.body);
    const description = req.body.description;
    const username = req.body.username;
    const title = req.body.title;
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    if (req.file) {
        //res.sendStatus(200);
        db.addImage(description, username, title, url)
            .then((result) => {
                console.log("result in addImage", result);
                res.json(result[0]);
            })
            .catch((err) => console.log("err in addImage: ", err));
    } else {
        res.sendStatus(500);
    }
});

app.get("/data.json", (req, res) => {
    db.getAllImageData().then((result) => {
        console.log("imageData: ", result);
        res.json(result.rows);
    });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
