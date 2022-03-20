const mongoose = require("mongoose");

const waveSchema = mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  status: { type: String, required: true },
  // timeStamp: { type: String, required: true },
  editor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Wave", waveSchema);