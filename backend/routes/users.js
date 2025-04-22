const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const user = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const NewUser = new user({
        email: req.body.email,
        password: hash,
      });
      return NewUser.save();
    })
    .then(() => {
      res.status(201).json({
        message: "User created!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = router;
