const port = 8080
const express = require('express');
const admZip = require('adm-zip');

//this cors is so I can access server from react app that runs on localhost:3000
const cors = require('cors');
const app = express();
const multer = require("multer");

var storage = multer.diskStorage({
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage:storage});

app.use(express.json())
app.use(cors());


app.post('/hello', (req: any, res: any) => {

    res.send({res:'what up client'})
})


app.post("/upload", upload.single("file"), function(req: any, res: any, next: any) {
    const {
        file,
        body: { name }
    } = req;

    const fileName = file.originalname;
   // fs.writeFile(fileName, file.buffer, ()=>{})

    var zip = new admZip(file.path);
    zip.extractAllTo(`${__dirname}/uploaded`, true);


    res.send("File uploaded as " + fileName);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})