const express = require("express");
const router = express.Router();

const checkLogin = require("../middlewares/check").checkLogin;
const PostModel = require("../models/posts");

// 所有用戶或特定用戶的文章頁
router.get("/", function(req, res, next) {
  let author = req.query.author;

  PostModel.getPosts(author)
    .then(function(posts) {
      res.render("posts", {
        posts: posts
      });
    })
    .catch(next);
});

// POST 發表一篇文章
router.post("/", checkLogin, function(req, res, next) {
  let author = req.session.user._id;
  let title = req.fields.title;
  let content = req.fields.content;

  try {
    if (!title.length) {
      throw new Error("請填寫標題");
    }
    if (!content.length) {
      throw new Error("請填寫內容");
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }

  let post = {
    author: author,
    title: title,
    content: content,
    pv: 0
  };

  PostModel.create(post)
    .then(function(result) {
      post = result.ops[0];
      req.flash("success", "發表成功");
      res.redirect(`/posts/${post._id}`);
    })
    .catch(next);
});

// GET 發表文章頁
router.get("/create", checkLogin, function(req, res, next) {
  res.render("create");
});

// GET 單獨一篇的文章頁
router.get("/:postId", function(req, res, next) {
  let postId = req.params.postId;

  Promise.all([PostModel.getPostById(postId), PostModel.incPv(postId)])
    .then(function(result) {
      let post = result[0];
      if (!post) {
        throw new Error("該文章不存在");
      }

      res.render("post", {
        post: post
      });
    })
    .catch(next);
});

// GET 更新文章頁
router.get("/:postId/edit", checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// POST 更新一篇文章
router.post("/:postId/edit", checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// GET 刪除一篇文章
router.get("/:postId/remove", checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// POST 建立一則留言
router.post("/:postId/comment", checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// GET 刪除一則留言
router.get("/:postId/comment/:commentId/remove", checkLogin, function(req, res, next) {
  res.send(req.flash());
});

module.exports = router;
