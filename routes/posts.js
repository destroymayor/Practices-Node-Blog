const express = require("express");
const router = express.Router();

const checkLogin = require("../middlewares/check").checkLogin;

// 所有用戶或特定用戶的文章頁
router.get("/", function(req, res, next) {
  res.render("posts");
});

// POST 發表一篇文章
router.post("/", checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// GET 發表文章頁
router.get("/create", checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// GET 單獨一篇的文章頁
router.get("/:postId", function(req, res, next) {
  res.send(req.flash());
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
