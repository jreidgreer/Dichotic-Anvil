//passport.js

var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../db.js').User;
var configAuth = require('./fb.js');

module.exports = function(app, session, passport) {
  //serialize user for session
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  //deserialize user
  passport.deserializeUser(function(user, done) {
    done(null, user);
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
    profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email', 'gender', 'birthday', 'picture.type(large)'],
  },

    function(accesstoken, refreshToken, profile, done) {
      // console.log('PROFILE:=============');
      console.log(profile);

      // console.log('TOKEN:=============');
      console.log(accesstoken);

      //find user in database based on facebook id
      User.findOne( { where: { 'userName' : profile._json.email.toLowerCase() } } )
      .then(function(user) {
        console.log('Found User', user);
        //if user is found, log in
        if (user) {
          done(null, user);
        } else {
          //create new user
          User.create({
            // name: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            userName: profile.emails[0].value.toLowerCase(),
            password: '1234',
            email: profile._json.email.toLowerCase(),
            facebookId: profile.id,
            picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'
          })
          .then(function(newUser) {
            console.log('user created ', newUser);
            done(null, newUser);
          })
          .catch(function(err) {
            console.log('Error saving Facebook user! ', err);
          });
        }
      })
      .catch(function(err) {
        console.log('Error Searching For Existing FB User: ', err);
      });
    }
  ));
};