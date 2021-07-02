const express = require('express');
const service = express.Router();
const _ = require('lodash');
const conn = require('./../database/dbConnection');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/items')
    },
    filename: (req, file, callBack) => {
      let filename = file.originalname.split('.');
      let extentioin = filename[filename.length-1];
      console.log("api 2" );
      console.log(global.phoneNumber);
      console.log(req.params.name);
        callBack(null, `${req.params.name}.${extentioin}`)
    }
  })
  const upload = multer({ storage: storage });




service.post('/register', (req, res) => {
    console.log(req.body)
    if(req.body.user_type == "Buyer"){
        conn.query(`INSERT INTO buyers_details (name, address, district, contact, password)  VALUES  
        ('${req.body.name}', '${req.body.address}' , '${req.body.district}', '${req.body.contact}', '${req.body.password}');`, function (err, result, fields) {
            if (err) {
                res.send(
                    {
                        'status': 'fails',
                        'data': err.sqlMessage
                    }
                );
                return
            };
            res.send(
                {
                    'status': 'success',
                    'data': "token"
                }
            );
        });
    }else if(req.body.user_type == "Seller"){
        conn.query(`INSERT INTO seller_details (name, address, district, contact, password)  VALUES  
        ('${req.body.name}', '${req.body.address}' , '${req.body.district}', '${req.body.contact}', '${req.body.password}');`, function (err, result, fields) {
            if (err) {
                res.send(
                    {
                        'status': 'fails',
                        'data': err.sqlMessage
                    }
                );
                return
            };
            res.send(
                {
                    'status': 'success',
                    'data': "token"
                }
            );
        });
    }
});


service.post('/login', (req, res) => {
    console.log(req.body)
    if(req.body.user_type == "Buyer"){
        conn.query(`SELECT * FROM buyers_details WHERE contact = ${req.body.contact} AND password = '${req.body.password}'`, function (err, result, fields) {
            if (err) {
                res.send(
                    {
                        'status': 'fails',
                        'data' : err.sqlMessage
                    }
                );    
                return
            }; 
            if(result.length == 0){
                res.send(
                    {
                        'status': 'invalid access',
                        'data' : 'username or password invalid'
                    }
                );      
            }else{
                const user = _.pick(result[0] , ['name', 'contact' ]);
                const token = jwt.sign({contact: user.contact , name:user.name , type:req.body.user_type} , "Hansana");
                res.header('x-auth-token' , token).send(
                    {
                        'status': 'success',
                        'data' : token
                    }
                ); 
            }   
        });
    }else if(req.body.user_type == "Seller"){
        conn.query(`SELECT * FROM seller_details WHERE contact = ${req.body.contact} AND password = '${req.body.password}'`, function (err, result, fields) {
            if (err) {
                res.send(
                    {
                        'status': 'fails',
                        'data' : err.sqlMessage
                    }
                );    
                return
            }; 
            if(result.length == 0){
                res.send(
                    {
                        'status': 'invalid access',
                        'data' : 'username or password invalid'
                    }
                );      
            }else{
                const user = _.pick(result[0] , ['name', 'contact' ]);
                const token = jwt.sign({contact: user.contact , name:user.name , type:req.body.user_type} , "Hansana");
                res.header('x-auth-token' , token).send(
                    {
                        'status': 'success',
                        'data' : token
                    }
                ); 
            }   
        });
    }
});


service.post('/addItem/:contact', (req, res) => {
    // console.log(`INSERT INTO item (name, price, quantity, quality, edate, mdate ,image ,seller ) VALUES (
    //     '${req.body.name}', '${req.body.price}' , '${req.body.quantity}', '${req.body.quality}', '${req.body.edate}','${req.body.mdate}' ,'${req.body.image}' , ${req.params.contact});`)
    conn.query(`INSERT INTO item (name, price, quantity, quality, edate, mdate ,image ,seller ) VALUES (
        '${req.body.name}', '${req.body.price}' , '${req.body.quantity}', '${req.body.quality}', '${req.body.edate}','${req.body.mdate}' ,'${req.body.image}' , ${req.params.contact});`, function (err, result, fields) {
        if (err) {
            res.send(
                {
                    'status': 'fails',
                    'data': err.sqlMessage
                }
            );
            return
        };
        res.send(
            {
                'status': 'success',
                'data': "token"
            }
        );
    });
});
service.post('/register/image/:name', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log("name is " + req.params.name);
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
    
    res.send({sttus:  'ok'});
   
});
service.post('/getItems/:contact', (req, res) => {
    console.log(`SELECT * FROM item WHERE seller = ${req.params.contact}';`);
    conn.query(`SELECT * FROM item WHERE seller = '0'+ '${req.params.contact}';`, function (err, result, fields) {
        if (err) {
            res.send(
                {
                    'status': 'fails',
                    'data' : err.sqlMessage
                }
            );    
            return
        }; 
        res.send(
            {
                'status': 'success',
                'data' : result
            }
        ); 
    });
});
service.post('/delItems/:itemCode', (req, res) => {
    
    conn.query(`DELETE FROM item WHERE item.item_code = '${req.params.itemCode}';`, function (err, result, fields) {
        if (err) {
            res.send(
                {
                    'status': 'fails',
                    'data' : err.sqlMessage
                }
            );    
            return
        }; 
        res.send(
            {
                'status': 'success',
                'data' : result
            }
        ); 
    });
});
service.post('/getItemsAll/', (req, res) => {
    // console.log(`SELECT * FROM item ;`);
    conn.query(`SELECT * FROM item WHERE item.quantity > 0;    `, function (err, result, fields) {
        if (err) {
            res.send(
                {
                    'status': 'fails',
                    'data' : err.sqlMessage
                }
            );    
            return
        }; 
        res.send(
            {
                'status': 'success',
                'data' : result
            }
        ); 
    });
});


module.exports = service;