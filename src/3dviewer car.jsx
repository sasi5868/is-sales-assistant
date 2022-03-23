import React, { Component } from 'react';
import gifFile from './data/car_gifs/Ford_Ecosport.gif';
// import BackgroundImg from "./images/background.jpg"
class ThreeDViewerCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsLoading: true,
      percentage: 0,
      TSPData: '',
    };
  }

  componentDidMount() {
    // this.InitScene();
    // this.loadModel();
  }

  onTransitionEnd(event) {
    event.target.remove();
  }

  render() {
    return (
      <>
        <div>
          <img
            className="w-full h-full object-cover"
            src={this.props.GifFile ? this.props.GifFile : gifFile}
          ></img>
          {/* <canvas
            ref={(ref) => (this.mount = ref)}
            style={{
              backgroundImage: "url('/envMaps/background.jpg')",
              backgroundSize: "cover",
            }}
          /> */}
        </div>
      </>
    );
  }
}
export default ThreeDViewerCar;
