var express = require('express');
const { UserModel } = require('../db/models');
const md5 = require('blueimp-md5');

var router = express.Router();

const filter = {password:0, __v:0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// user register
router.post('/register', function(req,res,next){
  const {username, password, type} = req.body;

  UserModel.findOne({username}, function(err,userDoc){
    if (userDoc) {
      res.send({code:1, msg:'The user already exists'})
    } else {
      new UserModel({username, type, password:md5(password)})
        .save(function(error, userDoc){
        res.cookie('userid', userDoc._id, {maxAge:1000*60*60*24});//1 day
        const data ={username, type, _id: userDoc._id}
        res.send({code:0, data:data});
      });
    }
  })
});


// login
router.post('/login', function(req,res){
  const {username,password} = req.body;

  UserModel.findOne({username, password:md5(password)},filter, function(err, userDoc){
    if(userDoc){
      res.cookie('userid', userDoc._id, {maxAge:1000*60*60*24});//1 day

      const data = userDoc;
      res.send({code:0, data:data})
    }
    else{
      res.send({code:1, data:{msg:'Username or password error'}})
    }
  })
});


module.exports = router;
