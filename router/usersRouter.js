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
  let finalUser = new User(user);
  let { salt, hash } = finalUser.setPassword(user.password);
  let email = user.email;
  finalUser = new User({ email, salt, hash });
  console.log(finalUser);
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

  console.log(user);

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
        res.cookie("token", user.token, { httpOnly: true });

        return res.json({ user: user.toAuthJSON() });
      }

      return res.status(500).json({ message: "Wrong username or password" });
    }
  )(req, res, next);
});

module.exports = router;
