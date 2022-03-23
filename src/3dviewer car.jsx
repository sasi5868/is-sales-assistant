import React, { Component } from "react";
import gifFile from "./data/car_gifs/Ford_Ecosport.gif"

class ThreeDViewerCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsLoading: true,
      percentage: 0
    };
  }

  componentDidMount() {
  }


  onTransitionEnd(event) {
    event.target.remove();
  }

  render() {
    return (
      <>
        <div>
          <img className="w-full h-full object-cover" src={this.props.GifFile ? this.props.GifFile : gifFile} ></img>
        </div>
      </>

    );
  }
}
export default ThreeDViewerCar;

