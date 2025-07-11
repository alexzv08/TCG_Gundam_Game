const mysql = require('mysql2');
const fs = require('fs');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./isrgrootx1.pem') // Ruta real a tu certificado CA
    }
});

// Convertir a promesas
const dbPromise = pool.promise();

module.exports = dbPromise;
