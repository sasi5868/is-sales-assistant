const express = require("express");
const router = express.Router();
const fs = require('fs');
const multer = require('multer');

const audioBbnlController = require("../controllers/audio_bbnl");

const MIME_TYPE_MAP = {
  "audio/wav": "wav"
  // ,"audio/mp3": "mp3"
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("request reached audio_bbnl inside routes");
    console.log("filemimeType",file.mimetype);
    console.log("fileName",file.originalname);
    req.body.fileName = file.originalname;
    const isValid = MIME_TYPE_MAP[file.mimetype];
    console.log("isValid",isValid)
    const audio_wav_dir = 'data/audio/bbnlTest';
    let error = null;
    var fs = require('fs');
    let dir = audio_wav_dir;
    console.log("audio destination", dir);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log('Your directory is created');
      } catch (e) {
        console.log("error while creating directory",e);
        error = "Error while creating directory";
      }
    }
    if (isValid == "wav") {
      error = null;
    } else {
      error = "Invalid audio file format";
    }
    console.log("error:",error);
    cb(error, dir);
  },
  filename: function (req, file, cb) {
    console.log("fileName",file.originalname);
    cb(null, file.originalname);
  },
});

router.post("", multer({ storage: storage }).single("audio"), audioBbnlController.postAudio);

module.exports = router;
