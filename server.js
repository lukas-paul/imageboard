const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("./public"));

app.use(express.json());

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
