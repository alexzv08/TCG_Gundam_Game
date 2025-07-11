const mysql = require('mysql2');
const fs = require('fs');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.TIDB_ENABLE_SSL === 'true' ? {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
        ca: process.env.TIDB_CA_PATH ? fs.readFileSync(process.env.TIDB_CA_PATH) : undefined // Ruta real a tu certificado CA
    } : null,
});

// Convertir a promesas
const dbPromise = pool.promise();

module.exports = dbPromise;
