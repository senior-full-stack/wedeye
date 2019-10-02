const dotenv = require("dotenv").load(),
  express = require("express"),
  app = express(),
  cors = require("cors"),
  PORT = process.env.PORT,
  logger = require("morgan"),
  mongoose = require("mongoose"),
  User = require("./models/User.js"),
  bodyParser = require("body-parser"),
  usersRoutes = require("./routes/users.js"),
  vendorsRoutes = require("./routes/vendors.js"),
  multipart = require("connect-multiparty"),
  AuthHttpInterceptor = require("./serverAuth"),
  MONGODB_URI = process.env.MONGODB_URI,
  fs = require("fs");

// create a directory to upload
var uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
var multipartMiddleware = multipart({ uploadDir: uploadDir });

// connect MongoDB
mongoose.set("useCreateIndex", true);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, err => {
  console.log(err || `Connected to MongoDB.`);
});
//create an admin account when user table of a database is empty
User.find({}, (err, users) => {
  if (users.length == 0) {
    const admin = {
      email: "admin@admin.com",
      name: "admin",
      password: "admin",
      type: "admin"
    };
    User.create(admin, (err, user) => {});
  }
});

var corsOptions = {
  origin: "*",
  "Allow-Control-Allow-Origin": "*",
  optionsSuccessStatus: 200
};

app.set("etag", false);
// disable cors policy
app.use(cors(corsOptions));
// set a public directory for downloading files
app.use("/uploads", express.static(`${__dirname}/uploads`));
app.use("/download", express.static(`${__dirname}/downloads`));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add a security filter to intercept and inspect requests for valid tokens.
app.use(AuthHttpInterceptor.intercept);
app.use("/api/users", usersRoutes);
app.use("/api/vendors", vendorsRoutes);
// upload a file
app.post("/api/upload", multipartMiddleware, (req, res) => {
  if (req.files.file) {
    const file = req.files.file;
    return res.json({
      success: true,
      path: `${file.path.replace(/uploads\//, "")}`
    });
  } else if (req.files.files) {
    const files = req.files.files;
    let paths = [];

    files.forEach(file => {
      paths.push(file.path.replace(/uploads\//, ""));
    });

    return res.json({
      success: true,
      path: paths
    });
  }
});
app.listen(PORT, err => {
  console.log(err || `Server running on port ${PORT}.`);
});
