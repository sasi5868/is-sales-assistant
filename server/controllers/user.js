const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const fs = require('fs');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    console.log("email: "+req.body.email);
    console.log("password: "+req.body.password);
    console.log("type: "+req.body.type);
    console.log("hash: "+hash);
    const user = new User({
      email: req.body.email,
      password: hash,
      type: req.body.type
    });
    user
      .save()
      .then(result => {
        console.log("result: "+result);
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        console.log("err: "+err);
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  console.log("email: "+req.body.email);
  console.log("password: "+req.body.password);
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log("user: "+user);
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      console.log("bcrypt: "+bcrypt.compare(req.body.password, user.password));
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      console.log("last result:"+result );
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      console.log("creating token with key"+process.env.JWT_KEY);
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
      );
      console.log("created token"+token);

      console.log("sending back response");
      return res.status(200).json({
        token: token,
        expiresIn: 86400,
        userId: fetchedUser._id,
        email: fetchedUser.email,
        type: fetchedUser.type
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
