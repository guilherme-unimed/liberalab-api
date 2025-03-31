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

app.post('/setconfig', async (req, res)=>{
    const url = req.body.url;
    const user = req.body.user;
    const pw = req.body.pw;
    const idhospital = req.body.idhospital;
    const key = req.body.key;
  
    fs.readFile("./config/setup.json", "utf8", (err, data)=>{
        if(err){
            console.log("Erro ao ler arquivo" + err);
            res.json({msg: "Erro ao ler arquivo" + err});
            return
        }
    
        var jsonData = JSON.parse(data);

        jsonData.url = url;
        jsonData.user = user;
        jsonData.pw = pw;
        jsonData.idhospital = idhospital;
        jsonData.key = key;

        fs.writeFile("./config/setup.json", JSON.stringify(jsonData, null, 2), (err) =>{
            if(err){
                console.log("Erro ao escrever arquivo" + err);
                res.json({msg: "Erro ao escrever arquivo" + err});
                return
            }
    
            res.json({msg: "Arquivo atualizado"});

        });
    });
});

app.get('/getconfig', (req, res) =>{
    fs.readFile("./config/setup.json", "utf8", (err, data)=>{
        if(err){
            console.log("Erro ao ler arquivo" + err);
            res.json({msg: "Erro ao ler arquivo" + err});
            return
        }
    
        let jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});

app.post('/criaordem', async (req, res) =>{
    
});

app.listen(port);
console.log("API iniciada");