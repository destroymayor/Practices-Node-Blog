const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const config = require("config-lite")(__dirname);
const routes = require("./routes");
const pkg = require("./package");
const winston = require("winston");
const expressWinston = require("express-winston");

const app = express();

// 設置view目錄
app.set("views", path.join(__dirname, "views"));

//設置模板引擎
app.set("view engine", "ejs");

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, "public")));

// session 中間件
app.use(
  session({
    name: config.session.key, //設置cookie中保存session id字段名稱
    secret: config.session.secret, //通過設置secret 計算ㄌhash值並放在cookie中，使產生的signedCookie防竄改
    cookie: {
      maxAge: config.session.maxAge //過期時間，過期後cookie中的session id自動刪除
    },
    store: new MongoStore({
      //將session 存到mongodb
      url: config.mongodb
    })
  })
);

// flash 中間件，顯示通知
app.use(flash());

app.use(
  require("express-formidable")({
    uploadDir: path.join(__dirname, "public/img"),
    keepExtensions: true
  })
);

app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash("success").toString();
  res.locals.error = req.flash("error").toString();
  next();
});

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        filename: "logs/success.log"
      })
    ]
  })
);

routes(app);

app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        filename: "logs/error.log"
      })
    ]
  })
);

app.listen(config.port, () => {
  console.log(`${pkg.name} listening on port ${config.port}`);
});

// start
// supervisor --harmony index
