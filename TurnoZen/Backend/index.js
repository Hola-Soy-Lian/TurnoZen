const express = require('express');
const mysql2 = require('mysql2');
const checkApiKey = require('./middlewares/checkApiKey');
const TurnoZen = express();
require('dotenv').config();


TurnoZen.use(express.json());
const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


TurnoZen.get('/api',checkApiKey,(req, res)=>{
    res.json({ message: 'Acceso autorizado, clave API valida.'});
});

db.connect((error)=>{
    if(error){
        console.error('error al conectar:',error);
        return;
    }
    console.log('conexion exitosa!');
});