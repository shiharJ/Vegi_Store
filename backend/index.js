const helmet = require('helmet');
const cors = require("cors");
const morgan = require('morgan');
const express = require('express');
const multer = require('multer');


const https = require('https');
const http = require('http');

const app = express();
app.use(cors({ origin: "*" }));

const service = require('./route/service');

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log("enableing Morgan...");
}


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/public" ,express.static('public'));
app.use(helmet());
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });


app.use('/service', service);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening to port ${port}.....`);
})


