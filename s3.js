const aws = require("aws-sdk");
const { AWS_SECRET, AWS_KEY } = require("./secrets");
const fs = require("fs");

const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file on server");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;
    console.log("req.file: ", req.file);
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            console.log("this worked!!!");
            next();
            fs.unlink(path, () => {
                console.log("file removed");
            });
        })
        .catch((err) => {
            console.log("err in cloud upload: ", err);
            return res.sendStatus(500);
        });
};
