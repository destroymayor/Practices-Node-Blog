const express = require("express");
const router = express.Router();

const sha1 = require("sha1");
const UserModel = require("../models/users");
const checkNotLogin = require("../middlewares/check").checkNotLogin;

// GET 登陸頁
router.get("/", checkNotLogin, function(req, res, next) {
  res.render("signin");
});

// POST 用戶登錄
router.post("/", checkNotLogin, function(req, res, next) {
  let name = req.fields.name;
  let password = req.fields.password;

  UserModel.getUserByName(name)
    .then(function(user) {
      if (!user) {
        req.flash("error", "用戶不存在");
        return res.redirect("back");
      }

      //檢查密碼
      if (sha1(password) !== user.password) {
        req.flash("error", "用戶名或密碼錯誤");
        return res.redirect("back");
      }

      req.flash("success", "登錄成功");

      delete user.password;
      req.session.user = user;

      res.redirect("/posts");
    })
    .catch(next);
});

module.exports = router;
