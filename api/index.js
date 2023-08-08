const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

const mongodbUri = process.env.MONGODB_URI;
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/test", (res, req) => {
  res.json("testingggggg");
});
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.create({
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      // logged in
      jwt.sign({ email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) {
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.cookie("token", token).json({
          id: userDoc._id,
          email,
        });
      });
    } else {
      res.status(401).json({ error: "Wrong credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Set the file name to be the original name
    cb(null, file.originalname);
  },
});

const uploadMiddleware = multer({ storage: storage });

app.post("/createpost", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];

  // Generate a random alphanumeric filename of length 10
  const randomFileName = crypto.randomBytes(5).toString("hex"); // Generates 10 characters (5 bytes in hex)

  const newPath = `uploads/${randomFileName}.${ext}`;

  // Rename the file to the new path
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, info) => {
    if (err) throw err;
    try {
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath, // Use the new filename as the cover for the post
        author: info.id,
      });
      res.json(postDoc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

app.post("/createpost", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];

  // Generate a random alphanumeric filename of length 10
  const randomFileName = crypto.randomBytes(5).toString("hex"); // Generates 10 characters (5 bytes in hex)

  const newPath = `uploads/${randomFileName}.${ext}`;

  // Rename the file to the new path
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, info) => {
    if (err) throw err;
    try {
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath, // Use the new filename as the cover for the post
        author: info.id,
      });
      res.json(postDoc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["email"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['email']);
  res.json(postDoc);
})

app.listen(5000);
//
//
