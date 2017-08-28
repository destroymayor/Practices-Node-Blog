const path = require("path");
const sha1 = require("sha1");
const express = require("express");
const router = express.Router();

const UserModel = require("../models/users");
const checkNotLogin = require("../middlewares/check").checkNotLogin;

// GET 註冊頁
router.get("/", checkNotLogin, function(req, res, next) {
  res.render("signup");
});

// POST 用戶註冊
router.post("/", checkNotLogin, function(req, res, next) {
  let name = req.fields.name;
  let gender = req.fields.gender;
  let bio = req.fields.bio;
  let avatar = req.files.avatar.path.split(path.sep).pop();
  let password = req.fields.password;
  let repassword = req.fields.repassword;

  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error("名字限制在1-10字");
    }
    if (["m", "f", "x"].indexOf(gender) === -1) {
      throw new Error("性別只能是m、f或x");
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error("個人簡介限制在1-30字");
    }
    if (!req.files.avatar.name) {
      throw new Error("請上傳頭像");
    }
    if (password.length < 6) {
      throw new Error("密碼至少6個字");
    }
    if (password !== repassword) {
      throw new Error("兩次密碼不一致");
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/signup");
  }

  password = sha1(password);

  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  };

  UserModel.create(user)
    .then(function(result) {
      user = result.ops[0];
      delete user.password;
      req.session.user = user;
      req.flash("success", "註冊成功");
      res.redirect("/posts");
    })
    .catch(function(e) {
      if (e.message.match("E11000 duplicate key")) {
        req.flash("error", "此用戶名已被使用");
        return res.redirect("signup");
      }
      next(e);
    });
});

module.exports = router;
