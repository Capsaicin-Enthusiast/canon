const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./model/post");

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
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

let posts = [];

app.get("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
    });
  });
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully!",
    });
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const updatedPost = req.body;
  const postId = req.params.id;
  posts = posts.map((post) => (post.id === postId ? updatedPost : post));
  res.status(200).json({ message: "Post updated successfully!" });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    console.log();
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;
