var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/userModel.js');
var fbConfig = require('./fb.js');

module.exports = function(app, session, passport) {
  app.use(session({
    secret: 'asdf',
    reset: true,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new FacebookStrategy({
    clientID: fbConfig.appID,
    clientSecret: fbConfig.appSecret,
    callbackURL: fbConfig.callbackUrl
  }, function(accessToken, refreshToken, profile, callback) {
    process.nextTick(function() {
      User.findOne({ facebookId: profile.id }, function(err, user) {
        if (err) {
          return callback(err);
        }
        if (user) {
          return callback(null, user);
        } else {
          var newUser = new User();

          newUser.fb.id = profile.id;
          newUser.fb.accessToken = accessToken;
          newUser.fb.firstName = profile.name.givenName;
          newUser.fb.lastName = profile.name.familyName;
          newUser.fb.email = profile.emails[0].value;

          newUser.save(function(err) {
            if (err) {
              console.log(err);
              return err;
            }
            return callback(null, newUser);
          });
        }
      });
    });
  }));


};