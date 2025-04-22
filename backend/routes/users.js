const express = require("express");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  res.status(201).json({ message: "User signed up successfully!" });
});

module.exports = router;
