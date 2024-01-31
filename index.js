import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

 app.get('/', (req, res)=>{
    res.send("<h1>Shree Ganesh </h1>");
 })

 const PORT = process.env.PORT;
 app.listen(PORT, ()=>{
    console.log("server started")
 })