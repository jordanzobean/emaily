const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const mongoose = require("mongoose");
const keys = require("../config/keys");

// This gives us access to the user model (schema) that we created in the user.js file. If we put in one arg it means we want to access the user schema, two args mean we're trying to load something into it. Now we can use this model class to create a new model instance and save it to the database.
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  // the user.id is an id property on the user record that was automatically created by mongo
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // accessing the database is always an async operation
  User.findById(id).then(user => {
    done(null, user);
  });
});

// new GoogleStrategy creates a new instance of the google passport strategy. This basically says "hey application, I want to use google strategy to authenticate my users." Inside of the constructor, we're going to pass in some information that tells this Google's strategy how to authenticate users inside of our application.
// Passport.use is a generic register. It says: "hey passport, you know how to handle auth requests in general, but you don't know how to do it with google, so use this strategy I'm providing to you"
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      // this is a relative path that we are specifying, which makes life easier in development. GoogleStrategy is able to work some magic and pre-pend the rest of the path to the beginning. Sometimes this doesn't result in good behavior. For example, if we want http vs https pre-pended. The reason why in this case https isn't prepended is because we are routing our request through heroku's proxy, and by default when googlestrategy sees we're routing through a proxy, it automatically drops the https. However, we trust that heroku's proxy is secure, so we can config googlestrategy to ignore it, or we can explicity specify the path value of the callbackURL.
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      // check if the user with a matching profile idea already exists in the model class. Finds the first record matching
      User.findOne({ googleID: profile.id }).then(existingUser => {
        if (existingUser) {
          // we already have a record with the profile id
          done(null, existingUser);
        } else {
          // if we just create a new model instance as we are below, it only creates that instance on the express server. We have to specify a save method to save it to the mongoose collection
          new User({
            googleID: profile.id
          })
            // save is an async operation.
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);

module.exports = {};
