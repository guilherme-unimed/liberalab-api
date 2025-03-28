const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3030;
const fetch = require('node-fetch');
const fs = require('fs');

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers","Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

fs.readFile("./config/setup.json", "utf8", (err, data)=>{
    if(err){
        return console.log("erro ao ler arquivo" + err);
    }

    let jsonData = JSON.parse(data);

    console.log(jsonData);
})