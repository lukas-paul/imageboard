const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbPassword = "postgres";
const database = "imageboard";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbPassword}@localhost:5432/${database}`
);

module.exports.getAllImageData = () => {
    return db.query(`SELECT * FROM images`);
};

module.exports.addImage = (description, username, title, url) => {
    const q = `INSERT INTO images (description, username, title, url)
                VALUES($1, $2, $3, $4)
                RETURNING *`;
    const params = [description, username, title, url];
    return db.query(q, params).then((result) => {
        return result.rows;
    });
};
