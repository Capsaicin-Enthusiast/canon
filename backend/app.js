const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // Added path module
const postroutes = require("./routes/posts");

const app = express();

mongoose
  .connect(
    "mongodb+srv://root:root@cluster0.tdbi4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images", express.static(path.join("backend/images")));

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/api/posts", postroutes);

module.exports = app;
