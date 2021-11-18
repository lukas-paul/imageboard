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

app.post("/uploadComment/:id", function (req, res) {
    console.log("req.body in uppload Comment: ", req.body);
    //add comment to the database
    const comment = req.body.comment;
    const author = req.body.username;
    const id = req.params.id;

    db.addComment(comment, author, id)
        .then((result) => {
            console.log("A comment was posted to the database", result.rows);
            res.json(result[0]);
        })
        .catch((err) => console.log("err in addComment: ", err));
});

app.get("/getAllComments/:id", function (req, res) {
    ("app.get getAll comments has been triggerd!");
    let id = req.params.id;
    db.getAllComments(id).then((result) => {
        console.log("getAllComments results: ", result);
        res.json(result.rows);
    });
});

app.get("/selectedImageData/:id", (req, res) => {
    console.log("get selected images has been triggerd");
    const { id } = req.params;
    db.getSelectedImage(id).then((result) => res.json(result));
});

app.get("/data.json/", (req, res) => {
    db.getAllImageData().then((result) => {
        res.json(result.rows);
    });
});

app.get("/moredata.jason/:lastId", (req, res) => {
    let lastId = req.params.lastId;
    console.log("last id in server.js: ", lastId);
    db.getMoreImages(lastId).then((result) => {
        console.log("result of get more images: ", result);
        res.json(result.rows);
    });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
