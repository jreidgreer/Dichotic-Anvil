//passport.js

var FacebookStrategy = require('passport-facebook').Strategy;
var facebookUser = require('../models/userModel.js');
var configAuth = require('./fb.js');

module.exports = function(app, session, passport) {
  //serialize user for session
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  //deserialize user
  passport.deserializeUser(function(user, done) {
    facebookUser.findById(user._id, function(err, user) {
      console.log('in deserialize============= ', user);
      done(err, user);
    });
  });

  //express session
  app.use(session({
    secret: 'shhsecret',
    resave: true,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
    }));

  //initialize passport and passport-session
  app.use(passport.initialize());
  app.use(passport.session());

  //FACEBOOK
  //=============================
  passport.use(new FacebookStrategy({
    //get infor form configAuth
    clientID: configAuth.facebookAuth.appID,
    clientSecret: configAuth.facebookAuth.appSecret,
    callbackURL: configAuth.facebookAuth.callbackUrl,
    profileFields: ['id', 'first_name', 'last_name', 'email'],
  },

    function(token, refreshToken, profile, done) {
      console.log('PROFILE:=============');
      console.log(profile);

      console.log('TOKEN:=============');
      console.log(token);
      //async
      process.nextTick(function() {

        //find user in database based on facebook id
        facebookUser.findOne( { 'facebook.id' : profile.id }, function(err, user) {

          //if err, return
          if (err) {
            return done(err);
          }

          //if user is found, log in
          if (user) {
            return done(null, user);
          } else {
            //create new user
            var newFacebookUser = new facebookUser();

            //set facebook info
            newFacebookUser.id = profile.id;
            newFacebookUser.token = token;
            newFacebookUser.name = profile.name.givenName + ' ' + profile.name.familyName;
            newFacebookUser.email = (profile.emails[0].value).toLowerCase();

            //save new user to database
            newFacebookUser.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, newFacebookUser);
            });
          }
        });
      });
    }
  ));
};