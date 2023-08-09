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
if (!jwtSecret) {
  console.error("JWT_SECRET environment variable is missing");
  process.exit(1);
}
app.use(cors({ credentials: true, origin: ["http://localhost:3000", "https://your-production-domain.com"] }));
app.use(express.json());
app.use(cookieParser());

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
  console.error("MONGODB_URI environment variable is missing");
  process.exit(1);
}
mongoose
  .connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

app.get("/test", (req, res) => {
  res.json("The server is online");
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

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["email"]);
  res.json(postDoc);
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (newPath) {
      postDoc.cover = newPath;
    }
    await postDoc.save();
    res.json(postDoc);
  });
});

app.delete("/post/:id", async (req, res) => {
  const postId = req.params.id;

  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, info) => {
    if (err) throw err;
    try {
      const postDoc = await Post.findById(postId);
      if (!postDoc) {
        return res.status(404).json("Post not found");
      }
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json("You are not the author");
      }
      // Delete the associated cover image file from the uploads directory
      const coverPath = path.join(__dirname, postDoc.cover);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
      await Post.deleteOne({ _id: postId }); // Use deleteOne to delete the post
      res.json("Post deleted successfully");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

module.exports = app;
