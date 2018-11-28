const passport = require('passport');
const router = require('express').Router();
const Users =require('../../models/User');
const UsersSession = require('../../models/UserSession');

router.get('/', function(req, res){
    Users.find()
    .then(user => res.json({user}));
})

router.get('/login', function(req, res){
    res.render('login');
})

router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            const newUserSession = new UsersSession({
                id : user._id,
                isAuth : req.isAuthenticated()
            })
            newUserSession.save((err, doc) => {
                if (err) {
                  console.log(err);
                  return res.send({
                    success: false,
                    message: 'Error: server error'
                  });
                }

            return res.json({session : newUserSession.authInfo()});
            });
        });
    })(req, res, next);
})

router.get('/register', function(req, res){
    res.render('register');
})

router.post('/register', function(req, res){
    const { body: { user } } = req;

    if(!user.username){
        return res.status(422).json({
        errors: {
            username: 'is required',
        },
        });
    }
    if(!user.email) {
        return res.status(422).json({
        errors: {
            email: 'is required',
        },
        });
    }

    if(!user.password) {
        return res.status(422).json({
        errors: {
            password: 'is required',
        },
        });
    }
    
    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({sucess : 'registered' }));
})

router.get('/logout', function(req, res){
    const {query : { id }} = req;
    UsersSession.find({id})
    .then(userSession => userSession.remove().then(() => res.json({succes : true})))
    .catch(err => res.status(404).json({status: false}));
    req.logout();
    req.session.destroy();
});

router.get('/verify', function(req, res){
    const {query:{ id }} = req;

    UsersSession.find({
        id: id,
        isDeleted: true
      }, (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        if (sessions.length != 1) {
          return res.send({
            success: false,
            message: 'Error: Invalid'
          });
        } else {
          // DO ACTION
          return res.send({
            success: true,
            message: 'Good'
          });
        }
      });
});

module.exports = router;