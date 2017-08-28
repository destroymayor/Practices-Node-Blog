const User = require("../lib/mongo").User;

module.exports = {
  //註冊
  create: function create(user) {
    return User.create(user).exec();
  },

  //通過用戶名取得訊息
  getUserByName: function getUserByName(name) {
    return User.findOne({ name: name }).addCreatedAt().exec();
  }
};
