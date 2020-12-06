const port = 8080
const express = require('express');
const admZip = require('adm-zip');
const fs = require("fs")
import {results} from "./src/Main";


const cors = require('cors');
const app = express();
const multer = require("multer");

var storage =  multer.diskStorage({
        dest: function (req: any, file: any, cb: any) {
            if (req.params.project === 'project1') {
                return cb(null, 'project1')
            } else {
                return  cb(null, 'project2')
            }
        },
    })


//REMOVE ANY TYPE ARGS
app.use(express.json())
app.use(cors());

var upload = multer({ storage }).single('file')

app.post("/upload/:project", upload, function(req: any, res: any, next: any) {
    const {file} = req;

    fs.rmdir("project1", ()=>{

        fs.rmdir("project2", ()=>{

            var zip2 = new admZip(file.path);
            zip2.extractAllTo(`${__dirname}/${req.params.project}`, true);


        })})


    res.send("success")
});

app.get("/plagiarism", function(req:any, res:any, next:any) {


    let result = results()


    //  res.send(JSON.stringify(result))


})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


