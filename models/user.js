const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: { type: String, unique: true },
  hash: { type: String },
  salt: { type: String },
});

UsersSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return { salt: this.salt, hash: this.hash };
};

UsersSchema.methods.validatePassword = (password, salt, hash) => {
  const newHash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
  console.log(newHash, hash);
  return newHash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    secret
  );
};

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};
const User = mongoose.model("User", UsersSchema);
module.exports = User;
