const express = require('express');
const path = require('path');
const bodyParser =  require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');

const config = require('./config/database');
const User = require('./model/user');


const app = express();

db = mongoose.connection;

//connect to mongod
mongoose.connect(config.database);
db = mongoose.connection;
// on connect
db.on('connected', () => {
    console.log('connected to database ' + config.database)
})
// error fail to connect
db.on('error', (error) => {
    console.log('fail to connect ' + error)
})

// use users for all user routes
const users = require('./routes/users');
const { required } = require('nodemon/lib/config');

// app use cors 
app.use(cors());

// body parser middleware
app.use(bodyParser.json());



// use static folder to client display
app.use(express.static(path.join(__dirname,'public')))

app.use('/users', users)

const port = 3000;

// use session middleware
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: config.secret
  }));

//passport middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// // Passport Local Strategy
// passport.use(User.createStrategy());

// // To use with sessions
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


require('./config/passport')(passport)

app.get('/', (req, res) => {
    res.send('invalid endpoint')
})

app.listen(port, () => {
    console.log("server listen on port " + port)
})