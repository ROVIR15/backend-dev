const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = require('../models/User');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
},async (username, password, done) => {
  Users.findOne({ username })
    .then((user) => {
      
      if(!user) {
        return done(null, false, { errors: { 'username or password': 'is invalid' } });
      }
      if(!user.isValidPassword(password)){
        return done(null, false, { errors: { 'password' : 'invalid'}});
      }
      return done(null, user);
    }).catch(done);
}));

passport.serializeUser(function(user, done) {
  return done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    return done(err, user);
  });
});