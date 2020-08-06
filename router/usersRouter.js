const mongoose = require("mongoose");
const passport = require("passport");
const router = require("express").Router();
const auth = require("./auth");
const User = mongoose.model("User");

router.post("/signup", auth.optional, (req, res, next) => {
  const {
    body: { user },
  } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
      },
    });
  }
  User.findOne({ email: user.email }).then((result) => {
    if (result != null) {
      res.status(422).json({
        errors: {
          email: "email is not free",
        },
      });
    }
  });
  const finalUser = new User(user);

  finalUser.setPassword(user.password);
  return finalUser
    .save()
    .then(() => res.json({ user: User(finalUser).toAuthJSON() }));
});

router.post("/signin", auth.optional, (req, res, next) => {
  const {
    body: { user },
  } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
      },
    });
  }

  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        res.cookie("token", user.token);

        return res.json({ user: user.toAuthJSON() });
      }

      return status(400).info;
    }
  )(req, res, next);
});

module.exports = router;
