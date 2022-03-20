import React, { Component } from "react";

import Papa from "papaparse";
import TableCar from "./Table"
import ThreeDViewer from "./3dviewer";
import ThreeDViewerCar from "./3dviewer car";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabledata: [],
    };
  }

  componentDidMount() {

  }


  render() {
    return (
      <>
      <div className="flex flex-row">
        <div class="grid grid-cols-2 divide-x">
        <div >
   
        <TableCar/>
        </div>
      <div className="grid grid-rows-2">
   
        <ThreeDViewerCar/>
           
        <ThreeDViewer/>
      </div>
      </div>
      </div>

    
      </>
    );
  }
}

export default Dashboard;
