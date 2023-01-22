const express = require("express");
const app = express();
const csv = require('csv-parse');
const bodyParser = require("body-parser");
const upload=require("express-fileupload");
var nodemailer = require('nodemailer');
var mv=require('mv');
// var spawn = require('child_process').spawn
var { spawn, exec } = require('child_process')

var child = exec('pwd')
const results = [];
app.use(upload());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
  // res.send('hello how are you')
});
app.post("/", function(request, response) {
  // Reading Python files
  var fileName;
  if(request.files){
    var file=request.files.file;
    fileName=file.name;
    file.mv('./public/'+fileName,function(err){
      if(err){
        response.send(err);
      }
    });
  }
  //spawn new child process to call the python script
  const python = spawn('python', ['public/102017151.py', 'public/'+fileName, request.body.weight, request.body.impact, 'public/output.csv']);
  // collect data from script
  python.stdout.on('data', function(data) {
    dataToSend = data.toString();
  });
  python.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  }); // in close event we are sure that stream from child process is closed
  python.on('exit', (code) =>{
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port:465,
      sender:'gmail',
      auth: {
          user: 'hsingh91218@gmail.com', // my mail
          pass: 'uiizuuejmphtgcop'
        }
      });

    var mailOptions = {
      from: 'hsingh91218@gmail.com',
      to: request.body.email,
      subject: 'Result of topsis',
      attachments: [{ // utf-8 string as an attachment
        filename:'output.csv',path: 'public/output.csv'
      }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent ');
      }
    });
  });
  response.sendFile(__dirname + "/success.html");
});

const PORT = process.env.PORT || 9001;
app.listen(PORT, function() {
  console.log("server started");
})