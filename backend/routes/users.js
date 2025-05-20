const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const user = require("../models/user");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const NewUser = new user({
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
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

router.patch("/update-password", checkAuth, (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  user
    .findById(req.userData.userId)
    .then((u) => {
      if (!u) {
        return res.status(404).json({ message: "User not found" });
      }
      return u.comparePassword(oldPassword).then((match) => {
        if (!match) {
          return res.status(401).json({ message: "Old password is incorrect" });
        }
        return bcrypt.hash(newPassword, 10).then((hash) => {
          u.password = hash;
          return u.save().then(() => {
            res.status(200).json({ message: "Password updated successfully" });
          });
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Password update failed" });
    });
});

router.patch("/update-profile", checkAuth, (req, res, next) => {
  const { firstName, lastName } = req.body;
  user
    .findById(req.userData.userId)
    .then((u) => {
      if (!u) {
        return res.status(404).json({ message: "User not found" });
      }
      u.firstName = firstName;
      u.lastName = lastName;
      return u.save();
    })
    .then((updated) => {
      res.status(200).json({
        message: "Profile updated",
        user: {
          firstName: updated.firstName,
          lastName: updated.lastName,
          email: updated.email,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Profile update failed" });
    });
});

module.exports = router;
