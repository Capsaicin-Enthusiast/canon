const express = require("express");

const app = express();

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "sdadadasda",
      title: "1st server-side post",
      content: "1st content from server-side",
    },
    {
      id: "fgdfsfdfs",
      title: "2nd server-side post",
      content: "2nd content from server-side",
    },
    {
      id: "dfsdfgfghg",
      title: "3rd server-side post",
      content: "3rd content from server-side",
    },
  ];

  res.status(200).json({
    message: "Posts fetched successfully!",
    posts: posts,
  });
});

module.exports = app;
