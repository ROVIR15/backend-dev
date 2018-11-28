const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const user = require('./routes/api/user')

const app = express();

require('./config/passport');
require('./models/User');
require('./models/UserSession')

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

const db = require('./config/keys').MongoURI;
const options = { useFindAndModify : false, useNewUrlParser: true};

mongoose
    .connect(db, options)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/users', user);
//app.use('/register', register);
//app.use('/logout', logout);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server started on port 5000'));