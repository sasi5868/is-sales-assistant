const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

const audioRoute = require("./routes/audio");
// const audioBbnlRoute = require("./routes/audio_bbnl");
const devTestRoute = require("./routes/devTest");
const cors = require("cors");
const app = express();

// mongodb+srv://sasi:<password>@cluster0.44riq.azure.mongodb.net/<dbname>?retryWrites=true&w=majority

// mongoose
//   .connect("mongodb+srv://sasi:yUHAHVd63Ev3DBi5@cluster0.44riq.azure.mongodb.net/cluster0?retryWrites=true&w=majority",
//   { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//   .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch((err) => {
//     console.log("Connection failed!",err);
//   });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use("/images_png", express.static(path.join("images_png")));
app.use("/intent_tts_audio", express.static(path.join("intent_tts_audio")));
app.use("/", express.static(path.join(__dirname, "build")));
app.use("/data", express.static(path.join(__dirname, "data/response")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/audio", audioRoute);
// app.use("/api/bbnl/audio", audioBbnlRoute);
app.use("/api/devTest", devTestRoute);
// GET home page.
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = app;
