const express = require("express");
const multer = require("multer");

const router = express();

const authCheck = require("../middleware/auth-check");
const extractFile = require("../middleware/imageFile");

const postController = require("../controllers/post");

const Post = require("../models/post");

router.post("", authCheck, extractFile, postController.createPost);

router.put("/:id", authCheck, extractFile, postController.editPost);

router.delete("/:id", authCheck, postController.deletPost);

router.get("/:id", postController.getPost);

router.get("", postController.getPosts);

module.exports = router;
