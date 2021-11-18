const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbPassword = "postgres";
const database = "imageboard";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbPassword}@localhost:5432/${database}`
);

module.exports.getAllImageData = () => {
    return db.query(
        `SELECT * FROM images
         ORDER BY id DESC
        LIMIT 10`
    );
};

module.exports.getMoreImages = (lastId) => {
    const params = [lastId];
    return db.query(
        `SELECT url, title, id, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1) AS "lowestId"
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 10;`,
        params
    );
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

module.exports.getSelectedImage = (id) => {
    const params = [id];
    return db
        .query(`SELECT * FROM images WHERE id=$1`, params)
        .then((result) => {
            return result.rows;
        });
};

module.exports.addComment = (comment, author, id) => {
    const params = [comment, author, id];
    return db
        .query(
            `INSERT INTO comments (comment, author, image_id)
                    VALUES($1, $2, $3)
                    RETURNING *`,
            params
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.getAllComments = (id) => {
    const params = [id];
    return db.query(
        `SELECT * FROM comments WHERE image_id=$1 ORDER BY id DESC`,
        params
    );
};
