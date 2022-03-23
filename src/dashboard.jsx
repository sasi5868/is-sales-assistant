import React, { Component } from "react";

import Papa from "papaparse";
import TableCar from "./Table"
import ThreeDViewer from "./3dviewer";
import ThreeDViewerCar from "./3dviewer car";
import axios from "axios";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabledata: [],
      gifFile: '',
      TSPFiles: '',
      TSPData: [],
      AudioFiles: []
    };
  }

  componentDidMount() {

  }
  dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  async GetData(audiodata) {
    const formData = new FormData();

    const file = this.dataURLtoFile(audiodata, "audiofile.mp3")
    formData.append("audio", file);
    formData.append("name", "audiofile.pm3");
    formData.append("languageId", 0);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: ""// JSON.parse(localStorage.getItem("token")).token,
      },

    }
    const response = await axios
      .post("http://localhost:3005/api/audio", formData,
        config)
    if (response.status === 200) {
      let arrdata = []
      for (let i = 0; i < response.data.nlpResponse.tsp_files.length; i++) {
        arrdata.push("http://localhost:3005/data/" + response.data.nlpResponse.tsp_files[i])
        //  let adata = await  this.fetchTsp("http://localhost:3005/data/"+response.data.nlpResponse.tsp_files[i],{
        //     crossDomain:true})
        //     arrdata =[...arrdata,...adata]
      }
      let audiofiles = []
      for (let i = 0; i < response.data.nlpResponse.audio.length; i++) {
        audiofiles.push("http://localhost:3005/data/" + response.data.nlpResponse.audio[i])
        //  let adata = await  this.fetchTsp("http://localhost:3005/data/"+response.data.nlpResponse.tsp_files[i],{
        //     crossDomain:true})
        //     arrdata =[...arrdata,...adata]
      }
      this.setState({
        TSPFiles: arrdata,
        AudioFiles: audiofiles
      });
      console.log(this.state.TSPData);
      this.setState({tabledata: "http://localhost:3005/data/combined_all_cars.xlsx"});
      this.setState({
        gifFile: "http://localhost:3005/data/car_gifs/" + response.data.nlpResponse.gif_car_model + ".gif",
      })
    }
    console.log(response);
  }
  async fetchTsp(url) {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const tsp = await decoder.decode(result.value);
    let arrdata = tsp.split(/\r?\n/);

    return arrdata;
  }
  render() {
    return (
      <>
        <div className="flex flex-row">
          <div class="grid grid-cols-2 divide-x">
            <div >
              <TableCar />
            </div>
            <div className="grid grid-rows-2">
              <ThreeDViewerCar GifFile={this.state.gifFile} />
              <ThreeDViewer GetData={(data) => this.GetData(data)} TSPFiles={this.state.TSPFiles} AudioFiles={this.state.AudioFiles} />
            </div>
          </div>
        </div>


      </>
    );
  }
}

export default Dashboard;
