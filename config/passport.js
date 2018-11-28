const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = require('../models/User');

passport.use(new LocalStrategy({
    usernameField : 'user[username]',
    passwordField : 'user[password]'
}, (username, password, done) => {
    Users.findOne({username})
    .then((user) => {
        if(!user){
            return done(null, false, {error : 'username is invalid'});
        }
        if(!user.isValidPassword(password)){
            return done(null, false, { error : 'password is invalid'})
        }
        console.log({user})
        return done(null, user);
    })
    })
)

passport.serializeUser(function(user, done){
    return done(null, user._id);
})

passport.deserializeUser(function(id, done){
    console.log(Users.find());
    Users.find({_id : '5bf9d0376d18ba1f786316b9'})
    .then(user, function(err, user){
        return done(err, user)
    });
});