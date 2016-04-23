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
    User.findById(user._id, function(err, user) {
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

    function(accesstoken, refreshToken, profile, done) {
      console.log('PROFILE:=============');
      console.log(profile);

      console.log('TOKEN:=============');
      console.log(accesstoken);

      done(null, profile);

      // User.findOrCreate(
      //   { facebookId: profile.id },
      // function(err, user) {
      //   if (user) {
      //     user.access_token = accessToken;
      //     user.save(function(err, doc) {
      //       done(err, doc);
      //     });
      //   } else {
      //     done(err, user);
      //   }
      // });

      //async
      process.nextTick(function() {

        //find user in database based on facebook id
        User.findOne( { 'facebook.id' : profile.id }, function(err, user) {

          //if err, return
          if (err) {
            return done(err);
          }

          //if user is found, log in
          if (user) {
            user.access_token = accesstoken;
            console.log("USER===============", user);
            done(null, user);
          } else {
            //create new user
            User.create({
              userName: profile.emails[0].value.toLowerCase(),
              password: 1234,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName
            }).then(function(err, newUser) {
              console.log('user created ', newUser);
              done(null, newUser);
            });

            //save new user to database
            User.save(function(err) {
              if (err) {
                throw err;
              }

              return done(null, User);
            });
          }
        });
      });
    }
  ));
};