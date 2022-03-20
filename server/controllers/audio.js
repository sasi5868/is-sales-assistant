const fs = require('fs');

function readFile(nlpResponseFilePath) {
  let nlpResponse = new Promise(async (resolve, reject) => {
    console.log("nlpResponseFilePath inside ReadFile", nlpResponseFilePath);
    // setTimeout(async () => {
      // await watchFile(nlpResponseFilePath).then((watchResponse) => {
      //   console.log("watchResponse in readFile", watchResponse);
        // if (watchResponse != null) {
          setTimeout(async () => {
            let readFileResponse = await fs.readFileSync(nlpResponseFilePath);
            // console.log("nlpResponse in readFile", readFileResponse);
            resolve(readFileResponse);
          }, 100);
        // } else {
        //   resolve(null);
        // }
    //   }).catch((err) => {
    //     console.log("error while watching and reading file sending null response", err);
    //     resolve(null);
    //   })
    // }, 500);
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

function executeScriptAsr(asrExecutionFile) {
  // exec('echo $PATH');
  console.log("asrExecutionFile:",asrExecutionFile);
  const { exec } = require("child_process");

  let executionResponse = new Promise(async (resolve, reject) => {
    exec(asrExecutionFile, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        resolve(false);
      }
      if (stderr) {
        // console.log(`stderr: ${stderr}`);
        resolve(true);
      }
      // console.log(`stdout: ${stdout}`);
      resolve(true);
    });
  });
  return executionResponse;
}

function executeScriptNlp(nlpExecutionFile) {
  // exec('echo $PATH');
  const { exec } = require("child_process");

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

exports.postAudio = async (req, res, next) => {
  console.log("saved audio file using multer", req.body.name);
  nlpResponse = {};
  languageId = req.body.languageId;
  console.log("languageId: ", languageId);

  asrInputFile = "/home/istl/demo/voice_channel_navigation/backend/data/audio/sasi@gmail.com/" + req.body.name;
  console.log("asrInputFile: ",asrInputFile);
  if(languageId == 0) {
    asrResponseFileName = req.body.name.replace("wav", "txt");
    asrResponseFilePath = "/home/istl/build/bbnl_english_nlp/process_dir/" + asrResponseFileName;
    asrExecutionFile = "/home/istl/build/kaldi/egs/bbnl_english_asr/s5/online_run.sh " + asrInputFile + " " + asrResponseFilePath;

    nlpResponseFileName = req.body.name.replace("wav", "json");
    nlpResponseFilePath = "/home/istl/build/bbnl_english_nlp/out_dir/" + nlpResponseFileName;
    nlpExecutionFile = "python3.8 /home/istl/build/bbnl_english_nlp/01_process_intent_english.py " + asrResponseFilePath + " " + nlpResponseFilePath;
  } else if(languageId == 1) {
    asrResponseFileName = req.body.name.replace("wav", "txt");
    asrResponseFilePath = "/home/istl/build/bbnl_hindi_nlp/process_dir/" + asrResponseFileName;
    asrExecutionFile = "/home/istl/build/kaldi/egs/bbnl_hindi_asr/s5/online_run.sh " + asrInputFile + " " + asrResponseFilePath;

    nlpResponseFileName = req.body.name.replace("wav", "json");
    nlpResponseFilePath = "/home/istl/build/bbnl_hindi_nlp/out_dir/" + nlpResponseFileName;
    nlpExecutionFile = "python3.8 /home/istl/build/bbnl_hindi_nlp/01_process_intent_hindi.py " + asrResponseFilePath + " " + nlpResponseFilePath;
  } else if(languageId == 2) {
    asrResponseFileName = req.body.name.replace("wav", "txt");
    asrResponseFilePath = "/home/istl/build/bbnl_tamil_nlp/process_dir/" + asrResponseFileName;
    asrExecutionFile = "/home/istl/build/kaldi/egs/bbnl_tamil_asr/s5/online_run.sh " + asrInputFile + " " + asrResponseFilePath;

    nlpResponseFileName = req.body.name.replace("wav", "json");
    nlpResponseFilePath = "/home/istl/build/bbnl_tamil_nlp/out_dir/" + nlpResponseFileName;
    nlpExecutionFile = "python3.8 /home/istl/build/bbnl_tamil_nlp/01_process_intent_tamil.py " + asrResponseFilePath + " " + nlpResponseFilePath;
  } else if(languageId == 3) {
    asrResponseFileName = req.body.name.replace("wav", "txt");
    asrResponseFilePath = "/home/istl/build/bbnl_kannada_nlp/process_dir/" + asrResponseFileName;
    asrExecutionFile = "/home/istl/build/kaldi/egs/bbnl_kannada_asr/s5/online_run.sh " + asrInputFile + " " + asrResponseFilePath;

    nlpResponseFileName = req.body.name.replace("wav", "json");
    nlpResponseFilePath = "/home/istl/build/bbnl_kannada_nlp/out_dir/" + nlpResponseFileName;
    nlpExecutionFile = "python3.8 /home/istl/build/bbnl_kannada_nlp/01_process_intent_kannada.py " + asrResponseFilePath + " " + nlpResponseFilePath;
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
  // nlpResponse = {"channel": "2", "volume": "2", "subscription": "YES", "program": "YES", "quality": "HD"}; // For reference

  executeScriptAsr(asrExecutionFile).then((response) => {
    console.log("ASR script execution response:", response);
    if(response == true) {
      executeScriptNlp(nlpExecutionFile).then(async(response) => {
        console.log("NLP script execution response:", response);
        //fs.unlinkSync(asrInputFile);
        if(response == true) {
          console.log("reading json file", nlpResponseFilePath);
          let readFileResponse = await readFile(nlpResponseFilePath);
          // console.log("nlpResponse in postAudio", readFileResponse);
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
          console.log("Unable to read response File");
          res.status(204).json({
            ok: false,
            message: "Unable to read file",
            intent: "NO_FILE",
            nlpResponse: {}
          });
        }
      });
    } else {
      console.log("Unable to read response File");
      res.status(204).json({
        ok: false,
        message: "Unable to read file",
        intent: "NO_FILE",
        nlpResponse: {}
      });
    }
  });
}
