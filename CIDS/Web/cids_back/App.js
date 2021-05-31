var createError = require('http-errors');
var logger = require('morgan');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //
var session = require('express-session'); // token 세션 등록
const httpProxy = require('http-proxy-middleware');
const mongoose = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');
const cors = require("cors");
const fileUpload = require('express-fileupload');

const config = require('./config');

/*
  DB connect position
*/
const connect = () =>{
    if(process.env.BODE_ENV !== "production"){
      mongoose.set("debug",true);
    }
    mongoose.connect('mongodb://'+config.db_id+':'+config.db_pw+'@'+config.db_address, {
        dbName: "cids_db",
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      error => {
        if (error){
          console.log("mongoDB connection error!\n",error);
        }
        else{
          console.log("mongoDB connection success!");
        }
      }
    );
    mongooseAutoInc.initialize(mongoose.connection);
  };
  
  connect();
  mongoose.connection.on("error",error => {
    console.log("mongoDB connection error!\n",error);
  });
  mongoose.connection.on("disconnected",() =>{
    console.log("mongoDB disconnection, try again connection ");
    connect();
  });


var searchRouter = require('./routes/search');
var userRouter = require('./routes/auth/userauth');
var postRouter = require('./routes/post/posts');
var commentRouter = require('./routes/post/comments');
var countDomainRouter = require('./routes/countDomain');
var dashBoardRouter = require('./routes/dashboard');

var passport = require('passport')

require('dotenv').config();

const app = express();

const PORT = 4000;
app.use(logger('dev')); //print Log
app.use(cors({  // 필수 사항
  origin: true,
  credentials: true
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        maxAge: 3 * 60 * 60 * 1000, // 3hours
        httpOnly: true,
        secure: false,
    }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());
require('./passport').config(passport);
app.use('/api/search', searchRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/countDomain',countDomainRouter);
app.use('/api/dashboard',dashBoardRouter);


app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}!`);
});


