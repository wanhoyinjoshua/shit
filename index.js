const express= require ("express");

var passport = require ('passport')
const isAuth = require('./routes/authMiddleware').isAuth;


const mongoose = require ('mongoose')
var session = require('express-session');
var routes_monthlyreport = require('./routes/monthlyreport');
var routes_loghours = require('./routes/loghours');

const genPassword = require('./lib/passwordUtils').genPassword;
const connection = require('./config/database');
const connectionactivity = require('./config/loghourform');
const User = connection.models.User;
const Useractivity = connectionactivity.models.Useractivity;
var MongoDBStore = require('connect-mongodb-session')(session);
//"mongodb+srv://wanhoyinjoshua:8sr^3B=81@cluster0.tbpnd.mongodb.net/goldsoul_scalabrini?retryWrites=true&w=majority"
var store = new MongoDBStore({
    uri: 'mongodb+srv://wanhoyinjoshua:8sr^3B=81@cluster0.tbpnd.mongodb.net/goldsoul_scalabrini?retryWrites=true&w=majority',
    collection: 'sessions'
  });
   
  // Catch errors
  store.on('error', function(error) {
    console.log(error);
  });

  const app= express();
   
  app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60*24*10*13 // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true
  }));


//parsing http responses 
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});
app.use(routes_monthlyreport);
app.use(routes_loghours);

const PORT = process.env.PORT||3000
require ('dotenv').config();

// set the view engine to ejs
app.set('view engine', 'ejs');
//passport middle ware
//setting up the session:

require('./config/passport')

//the engine already get it
app.get("/login",(req,res,next)=>{res.render('index')})


app.get('/logout', (req, res, next) => {
    req.logout();
    
    res.redirect('/');
});
app.get('/login-success/:id', isAuth, (req, res, next) => {
    
    res.render('loggedin',{user:req.user})
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure' }),function(req,res){res.redirect('/login-success/' + req.user.username);});

app.get("/register",(req,res,next)=>{res.render('register')})
app.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.pw);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.uname,
        hash: hash,
        salt: salt,
        admin: true
    });

    newUser.save()
        .then((user) => {
            console.log(user);
        });

    res.redirect('/login');
 });


app.listen(PORT,()=>console.log("lsitening on port 3000"))