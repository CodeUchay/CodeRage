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
const admin = require("firebase-admin");

const salt = bcrypt.genSaltSync(10);
// Generate a random JWT secret of 256 bits (32 bytes)
const MONGODB_URI = process.env.MONGODB_URI;

const jwtSecret = process.env.JWT_SECRET;

const firebaseAdminSdkJson = process.env.FIREBASE_ADMIN_SDK_JSON;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebaseAdminSdkJson)),
  storageBucket: "gs://coderage-mern.appspot.com",
});

const bucket = admin.storage().bucket();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://code-rage-blog.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(MONGODB_URI, {
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
  const { username, email, password } = req.body;
  try {
    const userDoc = await User.create({
      username, 
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/logout", async (req, res) => {
  // Clear the token cookie by setting its value to an empty string and expiring it
  res.cookie('token', '', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    path: '/', // Set the path to cover the entire domain
  });

  res.status(200).json({ success: true, message: 'User logged out successfully' });
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
        console.log(token);
        console.log("////");
        console.log(jwtSecret);

        res
          .cookie("token", token, {
            maxAge: 21600000,
            httpOnly: false,
            secure: true, // Set to true if using HTTPS
            sameSite: "None",
          })
          .json({
            id: userDoc._id,
            username, 
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
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, jwtSecret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    res.json(info);
  });
});

// app.post("/logout", (req, res) => {
//   res.cookie("token", "").json("ok");
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads/");
//   },  filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname); // Get the file extension
//     const randomFileName = crypto.randomBytes(10).toString("hex"); // Generates 20 characters (10 bytes in hex)
//     const sanitizedFileName = `${randomFileName}${ext}`; // Combine with the extension
//     cb(null, sanitizedFileName);
//   },
// });

// const uploadMiddleware = multer({ storage: storage });

const uploadMiddleware = multer();

app.post("/createpost", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, buffer } = req.file; // Use buffer instead of path

  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const randomFileName = crypto.randomBytes(5).toString("hex");
  const uniqueFilename = `${randomFileName}.${ext}`;

  const file = bucket.file(`images/${uniqueFilename}`); // Upload to Firebase Storage

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on("error", (err) => {
    console.error("Error uploading image to Firebase:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  stream.on("finish", async () => {
    try {
      const { token } = req.cookies;
      console.log("token----->>" + token);

      console.log("Decleared token----->>" + jwtSecret);
      const { title, summary, content } = req.body;
      jwt.verify(token, jwtSecret, {}, async (err, info) => {
        if (err) throw err;
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover: "", // We will update this later
          author: info.id,
        });

        // Get the download URL for the uploaded file
        const [downloadUrl] = await file.getSignedUrl({
          action: "read",
          expires: "03-01-2500", // Set a reasonable expiration date
        });

        // Update the postDoc with the download URL
        postDoc.cover = downloadUrl;

        await postDoc.save(); // Save the updated postDoc

        res.json(postDoc);
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  stream.end(buffer); // End the stream with the image buffer
});

// const publicUploadsPath = path.join(__dirname, "public/uploads");
// app.use("/uploads", express.static(publicUploadsPath));

// app.post("/createpost", uploadMiddleware.single("file"), async (req, res) => {
//   const { originalname, path } = req.file;
//   const parts = originalname.split(".");
//   const ext = parts[parts.length - 1];

//   // Generate a random alphanumeric filename of length 10
//   const randomFileName = crypto.randomBytes(5).toString("hex"); // Generates 10 characters (5 bytes in hex)

//   const newPath = `public/uploads/${randomFileName}.${ext}`;

//   // Rename the file to the new path
//   fs.renameSync(path, newPath);

//   const { token } = req.cookies;
//   jwt.verify(token, jwtSecret, {}, async (err, info) => {
//     if (err) throw err;
//     try {
//       const { title, summary, content } = req.body;
//       const postDoc = await Post.create({
//         title,
//         summary,
//         content,
//         cover: newPath, // Use the new filename as the cover for the post
//         author: info.id,
//       });
//       res.json(postDoc);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// });

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"]) //replaced email for username
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]); // replaced email with username 
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
