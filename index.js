const express = require("express");
const multiparty= require("multiparty");
const bodyParser = require("body-parser");
const fs = require("fs")

const app = express();
// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json());
const port = 4000;

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
    });

app.post("/api/upload",(req,res) => {
    const form = new multiparty.Form();
    form.parse(req,(err,field,files) => {
        if(err){
            console.log("失败",err)
            res.send("Error-->" + err);
            return;
        }
        if(!fs.existsSync("./source")){
            fs.mkdirSync("./source")
        }
        const cachefile = files.upload[0];
        const fileName  = cachefile.originalFilename.match(/[a-z]+\..+/)[0] //获取文件名称
        const writable = fs.createWriteStream("./source/" + fileName)
        const readable = fs.createReadStream(cachefile.path)
        readable.pipe(writable);
        readable.on("end",() => {
            res.status(200)
            res.send("OK");
        })
        readable.on("error",() => {
            res.status(500)
            res.send("Error")
        })
       
    })
})

app.listen(4000,() => {
    console.log("server start sucess. Host: http://localhost:4000")
})