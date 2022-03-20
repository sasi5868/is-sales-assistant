const fs = require('fs');

exports.test = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const mail = req.query.user;
  const devTestMessage = req.query.testMessage;
  const languageId = req.query.languageId;
  console.log("devTestMessage", devTestMessage);
  console.log("languageId", languageId);
  const fs = require('fs');
  fileName = new Date().getTime() + ".txt";

  nlpResponse = {};
  // nlpResponse = {"channel": "2", "volume": "2", "subscription": "YES", "program": "YES", "quality": "HD"}; // For reference
  nlpResponseFileName = fileName.replace("txt", "json");
  
  if(languageId == 0) {
    inputFilePath = "/home/istl/build/bbnl_english_nlp/process_dir/";
    inputFile = inputFilePath + fileName;
    console.log("inputFile:", inputFile);
    nlpResponseFilePath = "/home/istl/build/bbnl_english_nlp/out_dir/" + nlpResponseFileName;
    nlpExecutionFile = "python3.8 /home/istl/build/bbnl_english_nlp/01_process_intent_english.py " + inputFile + " " + nlpResponseFilePath;
    fs.writeFileSync(inputFile, devTestMessage);
  } else if(languageId == 1) {
    inputFilePath = "/home/istl/build/bbnl_hindi_nlp/process_dir/";
    inputFile = inputFilePath + fileName;
    console.log("inputFile:", inputFile);
    nlpResponseFilePath = "/home/istl/build/bbnl_hindi_nlp/out_dir/" + nlpResponseFileName;
    nlpExecutionFile = "python3.8 /home/istl/build/bbnl_hindi_nlp/01_process_intent_hindi.py " + inputFile + " " + nlpResponseFilePath;
    fs.writeFileSync(inputFile, devTestMessage);
  } else if(languageId == 2) {
    inputFilePath = "/home/istl/build/bbnl_tamil_nlp/process_dir/";
    inputFile = inputFilePath + fileName;
    console.log("inputFile:", inputFile);
    nlpResponseFilePath = "/home/istl/build/bbnl_tamil_nlp/out_dir/" + nlpResponseFileName;
    nlpExecutionFile = "python3.8 /home/istl/build/bbnl_tamil_nlp/01_process_intent_tamil.py " + inputFile + " " + nlpResponseFilePath;
    fs.writeFileSync(inputFile, devTestMessage);
  } else if(languageId == 3) {
    inputFilePath = "/home/istl/build/bbnl_kannada_nlp/process_dir/";
    inputFile = inputFilePath + fileName;
    console.log("inputFile:", inputFile);
    nlpResponseFilePath = "/home/istl/build/bbnl_kannada_nlp/out_dir/" + nlpResponseFileName;
    nlpExecutionFile = "python3.8 /home/istl/build/bbnl_kannada_nlp/01_process_intent_kannada.py " + inputFile + " " + nlpResponseFilePath;
    fs.writeFileSync(inputFile, devTestMessage);
  } else {
    console.log("Demo is not ready for this language");
    res.status(200).json({
      ok: false,
      message: "Demo is not ready for this language",
      intent: "NO_FILE",
      nlpResponse: {}
    });
    return;
  }
  executeScript(nlpExecutionFile).then(async(response) => {
    console.log("NLP script execution response:",response);
    if(response == true) {
      let readFileResponse = await readFile(nlpResponseFilePath);
      // console.log("nlpResponse in devTest", readFileResponse);
      fs.unlinkSync(nlpResponseFilePath);
      if (readFileResponse == null) {
        console.log("Unable to read response File");
        res.status(204).json({
          ok: false,
          message: "Unable to read file",
          intent: "NO_FILE",
          nlpResponse: {}
        });
      } else {
        nlpResponse = JSON.parse(readFileResponse);
        console.log("nlpResponse", nlpResponse);
        res.status(200).json({
          ok: true,
          message: "NLP response received",
          nlpResponse: nlpResponse
        });
      }
    } else {
      console.log("Error while executing NLP script");
      res.status(204).json({
        ok: false,
        message: "Error while executing NLP script",
        intent: "NO_FILE",
        nlpResponse: {}
      });
    }
  });
};



function readFile(nlpResponseFilePath) {
  let nlpResponse = new Promise(async (resolve, reject) => {
    console.log("nlpResponseFilePath inside ReadFile", nlpResponseFilePath);
    setTimeout(async () => {
      let readFileResponse = await fs.readFileSync(nlpResponseFilePath);
      // console.log("nlpResponse in readFile", readFileResponse);
      resolve(readFileResponse);
    }, 100);
  });
  return nlpResponse;
}

function watchFile(nlpResponseFilePath) {
  let watchResponse = new Promise(async (resolve, reject) => {
    try {
      fs.watch(nlpResponseFilePath, (eventType, filename) => {
        console.log("\nThe file", filename, "was modified!");
        console.log("The type of change was:", eventType);
        resolve(eventType);
      });
    } catch (err) {
      console.log('Error while watching file', err);
      resolve(null);
    }
  });
  return watchResponse;
}


function executeScript(nlpExecutionFile) {
  // exec('echo $PATH');
  const { exec } = require("child_process");
  // executionFile = "python3.8 /home/istl/build/bbnl_hindi_nlp/01_process_intent_hindi.py " + inputFile + " " + nlpResponseFilePath;
  // executionFile = "python3.8 /home/istl/build/bbnl_english_nlp/01_process_intent_english.py " + inputFile + " " + nlpResponseFilePath;
  let executionResponse = new Promise(async (resolve, reject) => {
    exec(nlpExecutionFile, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        resolve(false);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        resolve(false);
      }
      console.log(`stdout: ${stdout}`);
      resolve(true);
    });
  });
  return executionResponse;
}
