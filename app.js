require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const auth = require("./routes/auth");
const albums = require("./routes/albums");
const PORT = process.env.PORT || 5000;
const mySQL = require("./Database/connectmysql");

//Enable JSON, CORS , and COOKIES
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET));

//Home page
app.get("/", (req, res) => {
  res.send("<h1>Welcome to TapeStop</h1>");
});

//Login routes
app.use("/api/v1/accounts", auth);

//ALBUMS route
app.use(upload.single("audiofile"));
app.use("/api/v1/sound", albums);

//Redirect to Home
app.get("*", (req, res) => {
  res.redirect("/");
});

//404 error
app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

const start = async () => {
  try {
    await mySQL.sync({ force: false });
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
    console.log("Failed to start server");
  }
};

start();
