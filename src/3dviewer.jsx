import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import LoadingBar from "./Loadingbar";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import audiofile from "./data/TTS_ALIGN_FILE.wav";
// import BackgroundImg from "./images/background.jpg"
class ThreeDViewer extends Component {
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
    this.playNextAction = this.playNextAction.bind(this);
    this.animate = this.animate.bind(this);
  }
  async fetchTsp() {
    const response = await fetch("data/TTS_ALIGN_FILE.tsp");
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const tsp = await decoder.decode(result.value);
    console.log("tsp", tsp.split(/\r?\n/));
    this.setState({ TSPData: tsp.split(/\r?\n/) });
    return tsp;
  }
  componentDidMount() {
    this.fetchTsp();
    this.InitScene();
    this.loadModel();
    this.audio = new Audio(audiofile);
    this.audio.load();
  }

  playAudio() {
    this.currentActionIndex = 0;
    const audioPromise = this.audio.play();
    this.mixer.addEventListener("finished", this.playNextAction);
    this.playNextAction();
    if (audioPromise !== undefined) {
      audioPromise
        .then((_) => {
          // autoplay started
        })
        .catch((err) => {
          // catch dom exception
          console.info(err);
        });
    }
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
  SetFrames(animation) {
    console.log(animation);
    this.actions = [];
    this.currentActionIndex = 0;
    // for (let i=0;i<expressions.length;i++) {
    //   let frame = THREE.AnimationUtils.subclip( animation, i, expressions[i].from, expressions[i].to);
    //   const action = this.mixer.clipAction(frame);
    //   action.loop = THREE.LoopOnce;
    //   this.actions.push(action);
    // }
    for (let i = 0; i < this.state.TSPData.length; i++) {
      let char = this.state.TSPData[i].split(" ")[0];
      let duration = this.state.TSPData[i].split(" ")[1];
      let clipchar = expressions.filter((item) =>
        item.char.includes(char.toUpperCase())
      );
      if (clipchar && clipchar.length > 0) {
        let clipanim = clipchar[0];

        let frame = THREE.AnimationUtils.subclip(
          animation,
          i,
          clipanim.from,
          clipanim.to
        );
        // frame.duration=5;
        frame.duration = parseInt(duration) / 1000;
        const action = this.mixer.clipAction(frame);
        action.loop = THREE.LoopOnce;
        this.actions.push(action);
      } else {
        if (char.length === 2) {
          for (let j = 0; j < char.length; j++) {
            let clipchar = expressions.filter((item) =>
              item.char.includes(char[j].toUpperCase())
            );
            if (clipchar && clipchar.length > 0) {
              let clipanim = clipchar[0];

              let frame = THREE.AnimationUtils.subclip(
                animation,
                i,
                clipanim.from,
                clipanim.to
              );
              // frame.duration=5;
              frame.duration = parseInt(duration) / 1000 / 2;
              const action = this.mixer.clipAction(frame);
              action.loop = THREE.LoopOnce;
              this.actions.push(action);
            } else {
              console.log("Not found", char);
            }
          }
          console.log("Not found", char);
        }
      }
    }
    let framelast = THREE.AnimationUtils.subclip(
      animation,
      "last",
      expressions[1].from,
      expressions[1].to
    );
    // frame.duration=5;
    framelast.duration = 0.14;
    const actionlast = this.mixer.clipAction(framelast);
    actionlast.loop = THREE.LoopOnce;
    this.actions.push(actionlast);
    console.log(this.actions);
  }
  playNextAction() {
    if (this.currentActionIndex === this.actions.length) return;
    // this.mixer.setTime( 100 )
    var action = this.actions[this.currentActionIndex];
    action.play();
    this.currentActionIndex++;
  }
  loadFBX(loadingManager) {
    let _this = this;

    const loader = new FBXLoader(loadingManager);

    loader.load("models/Girl_With Expression_All.fbx", function (object) {
      console.log(object);
      _this.scene.add(object);
      _this.mixer = new THREE.AnimationMixer(object);
      const max = object.animations.reduce(function (prev, current) {
        return prev.duration > current.duration ? prev : current;
      });
      console.log("max", max);
      let Anim = max.clone();
      _this.SetFrames(Anim);

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

    const loadingManager = new THREE.LoadingManager(() => {
      const loadingScreen = document.getElementById("loading-screen");
      loadingScreen.classList.add("fade-out");
      // setTimeout(() => {
      //   _this.playAudio();
      // }, 3000);

      // optional: remove loader from DOM via event listener
      loadingScreen.addEventListener("transitionend", this.onTransitionEnd);
    });
    // this.loadGltf(loadingManager);
    this.loadFBX(loadingManager);

    this.animate();
  }
  InitScene() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );
    this.camera.position.set(0, 140, 100);
    this.camera.lookAt(new THREE.Vector3(0, 140, 0));
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.mount,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

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
        <section id="loading-screen">
          <div id="loader"></div>
        </section>
        <div>
          <canvas
            ref={(ref) => (this.mount = ref)}
            style={{
              backgroundImage: "url('/envMaps/background.jpg')",
              backgroundSize: "cover",
            }}
          />
        </div>
        <button
          style={{
            position: "absolute",
            bottom: "50px",
            left: "30px",
            fontSize: "large",
          }}
          onClick={() => this.playAudio()}
        >
          Play Audio{" "}
        </button>
        <audio
          className="clip"
          id="Q"
          src="https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
          type="audio/mpeg"
          ref={this.myRef}
        ></audio>
      </>
    );
  }
}
export default ThreeDViewer;

const expressions = [
  {
    from: 1,
    to: 21,
    char: ["STL"],
  },
  {
    from: 22,
    to: 47,
    char: ["SMILE", "SIL"],
  },
  {
    from: 48,
    to: 72,
    char: ["A", "AA"],
  },
  {
    from: 73,
    to: 100,
    char: ["I", "II"],
  },
  {
    from: 101,
    to: 123,
    char: ["U", "UU"],
  },
  {
    from: 124,
    to: 149,
    char: ["O", "OO"],
  },
  {
    from: 150,
    to: 174,
    char: ["E", "EE"],
  },
  {
    from: 175,
    to: 200,
    char: ["EU"],
  },
  {
    from: 201,
    to: 225,
    char: ["G", "K", "NG", "NY", "N", "R", "CH", "J"],
  },
  {
    from: 226,
    to: 251,
    char: ["F", "V"],
  },
  {
    from: 252,
    to: 276,
    char: ["P", "B", "M"],
  },
  {
    from: 277,
    to: 301,
    char: ["TH", "DH", "D"],
  },
  {
    from: 302,
    to: 327,
    char: ["Y"],
  },
  {
    from: 328,
    to: 349,
    char: ["S", "SH", "T", "L", "LL", "Z"],
  },
  {
    from: 350,
    to: 370,
    char: [""],
  },
];
