const express = require("express");
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
var path = require('path')
const audioController = require("../controllers/audio");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "audio/wav": "wav",
  "audio/mp3": "mp3"
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const audio_wav_dir = 'data/audio/sasi@gmail.com';
    var fs = require('fs');
    let dir = audio_wav_dir;
    console.log("audio destination", dir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    if (isValid) {
      error = null;
    }
    cb(null, dir)
    // cb(file, dir);
  },
  filename: function (req, file, cb) {
    console.log("fileName",req.body.name);
    cb(null, Date.now() + path.extname(file.originalname))
    cb(null, req.body.name);
  },
});

// router.post("", checkAuth, multer({ storage: storage }).single("audio"), audioController.postAudio);
router.post("", multer({ storage: storage }).single("audio"), audioController.postAudio);

module.exports = router;
