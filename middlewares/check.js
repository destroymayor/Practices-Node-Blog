module.exports = {
  checkLogin: (req, res, next) => {
    if (!req.session.user) {
      req.flash("error", "未登錄");
      return res.redirect("/signin");
    }
    next();
  },
  checkNotLogin: (req, res, next) => {
    if (req.session.user) {
      req.flash("error", "已登錄");
      return res.redirect("back");
    }
    next();
  }
};
