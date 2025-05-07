const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      console.error("Error:", error);
      if (error.name === "ValidationError") {
        const firstError = Object.values(error.errors)[0];
        return res.status(400).json({ message: firstError.message });
      }
      return res.status(500).json({ message: "Internal server error." });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  user
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid Authentication Credentials!" });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res
          .status(401)
          .json({ message: "Invalid Authentication Credentials!" });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "A_very_long_string_for_our_secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      console.error("Error:", err);
      return res
        .status(401)
        .json({ message: "Invalid Authentication Credentials!" });
    });
});

module.exports = router;
