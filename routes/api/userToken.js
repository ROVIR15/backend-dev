const passport = require('passport');
const router = require('express').Router();
const auth = require('./authjwt');
const Users =require('../../models/User');

//POST new user route (optional,POST everyone has access)
router.get('/collection', (req, res, next)=> {
  const user = req.query.user;
  console.log(user, '1');
  Users.findOne({username : user})
  .then(user => res.json(user));
})

router.post('/register', auth.optional, (req, res, next) => {
  console.log(req.headers, '2')
  console.log(req.session, '3');

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
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

router.get('/logout', (req, res)=> {
    const {query:{id}} = req;
    Users.findOne({_id : id})
    .then((user) => req.logout(user._id));
    req.session.destroy();
    res.json({succes : true,
      message : 'Logged out'
    });
    console.log(req.session);
})

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
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

  return passport.authenticate('local', { session: true, successRedirect: '/', failureRedirect: '/login'}, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();
      req.login(user._id, function(err){
        if(err) return next(err);
      });
      return res.json({ user: user.toAuthJSON()});
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;
  console.log(req.payload);
  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(401);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

module.exports = router;