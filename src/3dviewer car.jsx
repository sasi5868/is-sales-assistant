import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gifFile from "./data/car_gifs/Ford_Ecosport.gif"
// import BackgroundImg from "./images/background.jpg"
class ThreeDViewerCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsLoading: true,
      percentage: 0,
      TSPData: "",
    };
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camer = null;
    this.mount = null;
    this.renderer = null;
    this.mixer = null;
    this.controls = null;
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {

    // this.InitScene();
    // this.loadModel();

  }


  onTransitionEnd(event) {
    event.target.remove();
  }
  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    let delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    this.renderer.render(this.scene, this.camera);
  }
  loadGltf(loadingManager) {
    let _this = this;
    const loader = new GLTFLoader(loadingManager);
    loader.load("models/girl1.glb", function (gltf) {
      let model = gltf.scene;
      _this.scene.add(model);
      console.log(model);
      model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
      });

      _this.skeleton = new THREE.SkeletonHelper(model);
      _this.skeleton.visible = false;
      _this.scene.add(_this.skeleton);

      const animations = gltf.animations;

      _this.mixer = new THREE.AnimationMixer(model);
      _this.AnimationClips = [];
      animations.forEach((clip) => {
        _this.AnimationClips.push(_this.mixer.clipAction(clip));
      });
      _this.AnimationClips.forEach((clip) => {
        clip.play();
      });
    });
  }
 

  loadFBX() {
    let _this = this;

    const loader = new FBXLoader();

    loader.load("models/Girl_With Expression_All2.fbx", function (object) {
      console.log(object);
      _this.scene.add(object);
  

      object.traverse(function (child) {
        if (child.isMesh) {
          console.log(child);
          child.castShadow = true;
          child.receiveShadow = true;
          var material = child.material;
          if (Array.isArray(material)) {
            if (material[0].isMeshPhongMaterial) {
              material[0].shininess = 0;
            }
          } else if (material.isMeshPhongMaterial) {
            material.shininess = 0;
          }
        }
      });
    });
  }
  async loadModel() {
    let _this = this;

    // const loadingManager = new THREE.LoadingManager(() => {
    //   const loadingScreen = document.getElementById("loading-screen");
    //   loadingScreen.classList.add("fade-out");
    //   // setTimeout(() => {
    //   //   _this.playAudio();
    //   // }, 3000);

    //   // optional: remove loader from DOM via event listener
    //   loadingScreen.addEventListener("transitionend", this.onTransitionEnd);
    // });
    // this.loadGltf(loadingManager);
    this.loadFBX();

    this.animate();
  }
  InitScene() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      (window.innerWidth/2) / (window.innerHeight/2),
      1,
      20000
    );
    this.camera.position.set(0, 140, 100);
    this.camera.lookAt(new THREE.Vector3(0, 140, 0));
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.mount,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);

    const light = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(light);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(0, 0, 400);
    dirLight.target.position.set(0, 600, 0);
    this.scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight2.position.set(0, 0, -400);
    dirLight2.target.position.set(0, -600, 0);
    this.scene.add(dirLight2);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 140, 0);
    this.controls.update();
  }
  render() {
    return (
      <>

        <div>
          <img className="w-full h-full object-cover" src={this.props.GifFile?this.props.GifFile:gifFile} ></img>
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

