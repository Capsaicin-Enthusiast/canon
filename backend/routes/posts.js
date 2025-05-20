const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();
const Post = require("../models/post");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    post
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...result,
            id: result._id,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "Creating A Post Failed!" });
      });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        if (result.matchedCount > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not Authorized!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Couldn't Update Post!" });
      });
  }
);

router.get("", (req, res, next) => {
  const PageSize = +req.query.pagesize;
  const CurrentPage = +req.query.page;
  const titleFilter = req.query.title;
  // build filter object: if titleFilter exists, do a case‐insensitive substring match
  const filter = titleFilter
    ? { title: { $regex: titleFilter, $options: "i" } }
    : {};
  const postquery = Post.find(filter);

  let fetchedPosts;

  if (PageSize && CurrentPage) {
    postquery.skip(PageSize * (CurrentPage - 1)).limit(PageSize);
  }

  postquery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments(filter); // ← use same filter for count
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts Fetched Successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching Posts Failed!" });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not Found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching Posts Failed!" });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Deletion Successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Deletion Not Done!" });
    });
});

module.exports = router;
