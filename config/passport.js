const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]",
    },
    (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          console.log(user);
          if (!user || !user.validatePassword(password, user.salt, user.hash)) {
            return done(null, false, {
              errors: { "email or password": "is invalid" },
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);
