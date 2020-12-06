const port = 8080
const express = require('express');
const admZip = require('adm-zip');
const fs = require("fs")
import {results} from "./src/Main";


const cors = require('cors');
const app = express();
const multer = require("multer");

//const {results} = require("./src/Main")

//console.log(results());

var storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        if (req.params.project === 'project1') {
           return cb(null, 'project1')
        } else {
          return  cb(null, 'project2')
        }
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
})

//REMOVE ANY TYPE ARGS
app.use(express.json())
app.use(cors());

var upload = multer({ storage: storage }).single('file')

app.post("/upload/:project", upload, function(req: any, res: any, next: any) {
    const {file} = req;

    var zip2 = new admZip(file.path);
    zip2.extractAllTo(`${__dirname}/${req.params.project}`, true);


});

app.get("/plagiarism", function(req:any, res:any, next:any) {

    if(results){
      res.send(JSON.stringify(results))
   }

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


