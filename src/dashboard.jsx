import React, { Component } from 'react';

import Papa from 'papaparse';
import TableCar from './Table';
import TableMod from './Table_Modified'
import ThreeDViewer from './3dviewer';
import ThreeDViewerCar from './3dviewer car';
import axios from 'axios';

// import carUniqueIdList from './data/carUniqueIdList';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabledata: [],
      gifFile: '',
      TSPFiles: '',
      TSPData: [],
      AudioFiles: [],
      carsShow:[],
      rowsHighlight:[]
    };
  }

  componentDidMount() {}
  

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

    const file = this.dataURLtoFile(audiodata, 'audiofile.wav');
    formData.append('audio', file);
    formData.append('name', 'audiofile.wav');

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: '', // JSON.parse(localStorage.getItem("token")).token,
      },
    };
    const response = await axios.post(
      'http://localhost:3005/api/audio',
      formData,
      config
    );
    if (response.status === 200) {
      let arrdata = [];
      for (let i = 0; i < response.data.nlpResponse.tsp_files.length; i++) {
        arrdata.push(
          'http://localhost:3005/data/' + response.data.nlpResponse.tsp_files[i]
        );
        //  let adata = await  this.fetchTsp("http://localhost:3005/data/"+response.data.nlpResponse.tsp_files[i],{
        //     crossDomain:true})
        //     arrdata =[...arrdata,...adata]
      }
      let audiofiles = [];
      for (let i = 0; i < response.data.nlpResponse.audio.length; i++) {
        audiofiles.push(
          'http://localhost:3005/data/' + response.data.nlpResponse.audio[i]
        );
        //  let adata = await  this.fetchTsp("http://localhost:3005/data/"+response.data.nlpResponse.tsp_files[i],{
        //     crossDomain:true})
        //     arrdata =[...arrdata,...adata]
      }
      // TODO Set the Cars & Rows to highlight to Show to the State
   
      let carIdsToShow = response.data.nlpResponse.highlight_cols;
      let rowIdsToShow = response.data.nlpResponse.highlight_rows;
      let carsToShow = [];
      let rowsToHighlight = [];
      carIdsToShow.map((id) => {
        carUniqueIdList.map((item) => {
          if(item.id == id) {
            carsToShow.push(item.name);
          }
        })
      });
      rowIdsToShow.map((id) => {
        rowsUniqueIdList.map((item) => {
          if(item.id == id) {
            rowsToHighlight.push(item.name);
          }
        })
      })

      this.setState({
        TSPFiles: arrdata,
        AudioFiles: audiofiles,
        carsShow: carsToShow,
        rowsHighlight: rowsToHighlight
      });
      // console.log(this.state.TSPData);
      // this.setState({tabledata: "http://localhost:3005/data/combined_all_cars.xlsx"});
      this.setState({
        gifFile:
          'http://localhost:3005/data/car_gifs/' +
          response.data.nlpResponse.gif_car_model +
          '.gif',
      });
    }
    console.log(this.state.carsShow);
    console.log(this.state.rowsHighlight);
  }

  async fetchTsp(url) {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const tsp = await decoder.decode(result.value);
    let arrdata = tsp.split(/\r?\n/);

    return arrdata;
  }

// setAudioTarget(vl){
//   this.setState({
//     selectedCarState: vl
//   })
// }

  render() {
    return (
      <div className="dashboardContainer">
        <div className="infoContainer">
          {/* <TableCar carsShow={this.state.carsShow} rowsHighlight={this.state.rowsHighlight} setAudioTarget={(val)=>this.setAudioTarget(val)} /> */}
          <TableCar carsShow={this.state.carsShow} rowsHighlight={this.state.rowsHighlight} />
        </div>
        <div className="dashBoardGraphicsContainer">
          <ThreeDViewerCar GifFile={this.state.gifFile} />
          <ThreeDViewer
            GetData={(data) => this.GetData(data)}
            TSPFiles={this.state.TSPFiles}
            AudioFiles={this.state.AudioFiles}
          />
        </div>
      </div>
    );
  }
}

const carUniqueIdList = [
  {"id":"0","name":"Ford Figo Ambiente petrol"},
  {"id":"1","name":"Ford Figo Titanium petrol"},
  {"id":"2","name":"Ford Figo Titanium AT petrol"},
  {"id":"3","name":"Ford Figo Titanium Diesel"},
  {"id":"4","name":"Ford Ecosport ambiente petrol"},
  {"id":"5","name":"Ford Ecosport ambiente diesel"},
  {"id":"6","name":"Ford Ecosport trend petrol"},
  {"id":"7","name":"Ford Ecosport trend diesel"},
  {"id":"8","name":"Ford Ecosport titanium petrol"},
  {"id":"9","name":"Ford Ecosport titanium diesel"},
  {"id":"10","name":"Honda City V MT Petrol"},
  {"id":"11","name":"Honda City V CVT Petrol"},
  {"id":"12","name":"Honda City VX MT Petrol"},
  {"id":"13","name":"Honda City V MT Diesel"},
  {"id":"14","name":"Honda City VX MT Diesel"},
  {"id":"15","name":"Honda City ZX CVT Petrol"},
  {"id":"16","name":"Honda City VX CVT Petrol"},
  {"id":"17","name":"Honda Jazz VX MT Petrol"},
  {"id":"18","name":"Honda Jazz ZX MT Petrol"},
  {"id":"19","name":"Honda Jazz VX CVT Petrol"},
  {"id":"20","name":"Honda Jazz ZX CVT Petrol"},
  {"id":"21","name":"Hyundai grand i10 NIOS Magna MT Petrol"},
  {"id":"22","name":"Hyundai grand i10 NIOS Magna AMT Petrol"},
  {"id":"23","name":"Hyundai grand i10 NIOS Sportz MT Petrol"},
  {"id":"24","name":"Hyundai grand i10 NIOS Sportz MT Diesel"},
  {"id":"25","name":"Hyundai grand i10 NIOS Asta CRDi"},
  {"id":"26","name":"Hyundai verna SX MT Petrol"},
  {"id":"27","name":"Hyundai verna SX MT Diesel"},
  {"id":"28","name":"Hyundai verna SX AT Diesel"},
  {"id":"29","name":"Hyundai verna Splus MT Petrol"},
  {"id":"30","name":"Hyundai verna SPlus MT Diesel"},
  {"id":"31","name":"Mahindra Bolero Neo N8 MT Diesel"},
  {"id":"32","name":"Mahindra Bolero Neo N10 MT Diesel"},
  {"id":"33","name":"Mahindra Bolero Neo N4 MT Diesel"},
  {"id":"34","name":"Mahindra XUV700 MX MT Petrol"},
  {"id":"35","name":"Mahindra XUV700 MX MT Diesel"},
  {"id":"36","name":"Mahindra XUV700 AX5 Automatic Petrol"},
  {"id":"37","name":"Mahindra XUV700 AX5 Automatic Diesel"},
  {"id":"38","name":"Mahindra XUV700 AX7 Automatic Petrol"},
  {"id":"39","name":"Mahindra XUV700 AX7 Automatic Diesel"},
  {"id":"40","name":"Maruti Suzuki Baleno Sigma MT Petrol"},
  {"id":"41","name":"Maruti Suzuki Baleno Delta MT Petrol"},
  {"id":"42","name":"Maruti Suzuki Baleno Zeta MT Petrol"},
  {"id":"43","name":"Maruti Suzuki Baleno Zeta Automatic Petrol"},
  {"id":"44","name":"Maruti Suzuki Baleno Delta Automatic Petrol"},
  {"id":"45","name":"Maruti Suzuki Baleno Alpha MT Petrol"},
  {"id":"46","name":"Maruti Suzuki Dzire LXI MT Petrol"},
  {"id":"47","name":"Maruti Suzuki Dzire VXI MT Petrol"},
  {"id":"48","name":"Tata Nexon XZ Petrol"},
  {"id":"49","name":"Tata Nexon XM Petrol"},
  {"id":"50","name":"Tata Nexon XMA AMT Petrol"},
  {"id":"51","name":"Tata Nexon XM MT Diesel"},
  {"id":"52","name":"Tata Nexon XMA AMT Diesel"},
  {"id":"53","name":"Tata Tiago XT MT Petrol"},
  {"id":"54","name":"Tata Tiago XZ MT Petrol"},
  {"id":"55","name":"Tata Tiago XTA Automatic Petrol"},
  {"id":"56","name":"Tata Tiago XZPlus MT Petrol"},
  {"id":"57","name":"Toyota Innova 2.5 VX MT Diesel"},
  {"id":"58","name":"Toyota Innova 2.5 ZX MT Diesel"},
  {"id":"59","name":"Toyota Innova 2.5 GX MT Diesel"},
  {"id":"60","name":"Toyota Urban Cruiser Mid MT Petrol"},
  {"id":"61","name":"Toyota Urban Cruiser High MT Petrol"},
  {"id":"62","name":"Toyota Urban Cruiser Premium MT Petrol"},
  {"id":"63","name":"Toyota Urban Cruiser Premium Automatic Petrol"},
  {"id":"64","name":"Toyota Urban Cruiser High Automatic Petrol"}
  ];

const rowsUniqueIdList = [
  { "id": "0", "name": "mod_variants" },
{ "id": "1", "name": "gen_info" },
{ "id": "2", "name": "bod_type" },
{ "id": "3", "name": "bod_colors" },
{ "id": "4", "name": "eng_cylinders" },
{ "id": "5", "name": "eng_compression_ratio" },
{ "id": "6", "name": "eng_displacement" },
{ "id": "7", "name": "eng_max_out" },
{ "id": "8", "name": "eng_max_torque" },
{ "id": "9", "name": "eng_fuel_type" },
{ "id": "10", "name": "eng_mileage" },
{ "id": "11", "name": "eng_gearbox_type" },
{ "id": "12", "name": "eng_num_gears" },
{ "id": "13", "name": "eng_camshaft" },
{ "id": "14", "name": "eng_trans_type" },
{ "id": "15", "name": "eng_drive_mode" },
{ "id": "16", "name": "eng_others" },
{ "id": "17", "name": "dim_length" },
{ "id": "18", "name": "dim_width" },
{ "id": "19", "name": "dim_height" },
{ "id": "20", "name": "dim_wheelbase" },
{ "id": "21", "name": "dim_turning_circle_radius" },
{ "id": "22", "name": "dim_fuel_tank_capacity" },
{ "id": "23", "name": "dim_gross_vehicle_weight" },
{ "id": "24", "name": "dim_kerb_weight" },
{ "id": "25", "name": "dim_trunk_space" },
{ "id": "26", "name": "dim_ground_clearance" },
{ "id": "27", "name": "dim_seating_capacity" },
{ "id": "28", "name": "ssb_front_suspension" },
{ "id": "29", "name": "ssb_rear_suspension" },
{ "id": "30", "name": "ssb_shock_absorbers" },
{ "id": "31", "name": "ssb_front_brakes" },
{ "id": "32", "name": "ssb_rear_brakes" },
{ "id": "33", "name": "ssb_steering_technology" },
{ "id": "34", "name": "ssb_steering_functionality" },
{ "id": "35", "name": "ssb_wheel_type" },
{ "id": "36", "name": "ssb_tyre_size" },
{ "id": "37", "name": "ext_rear_fog_lamp" },
{ "id": "38", "name": "ext_outer_door_handles" },
{ "id": "39", "name": "ext_front_radiator_grille_surround" },
{ "id": "40", "name": "ext_front_radiator_grille_mesh" },
{ "id": "41", "name": "ext_orvm" },
{ "id": "42", "name": "ext_bumper_applique" },
{ "id": "43", "name": "ext_fog_lamp_bezel" },
{ "id": "44", "name": "ext_wheel_covers" },
{ "id": "45", "name": "ext_alloy_wheel" },
{ "id": "46", "name": "ext_front_fog_lamp" },
{ "id": "47", "name": "ext_bpillar_black_applique" },
{ "id": "48", "name": "ext_rear_window_defogger" },
{ "id": "49", "name": "ext_wiper" },
{ "id": "50", "name": "ext_rear_washer_wiper" },
{ "id": "51", "name": "ext_rear_spoiler" },
{ "id": "52", "name": "ext_roof_rails" },
{ "id": "53", "name": "ext_roof_paint" },
{ "id": "54", "name": "ext_se_badge" },
{ "id": "55", "name": "ext_head_lamp" },
{ "id": "56", "name": "ext_led_drl" },
{ "id": "57", "name": "ext_trunk_opener" },
{ "id": "58", "name": "ext_sunroof" },
{ "id": "59", "name": "ext_rear_applique" },
{ "id": "60", "name": "ext_turn_signal_lamp" },
{ "id": "61", "name": "ext_tail_lamp" },
{ "id": "62", "name": "ext_antenna" },
{ "id": "63", "name": "ext_indicator_on_door_mirror" },
{ "id": "64", "name": "ext_rear_led_wing_lamp" },
{ "id": "65", "name": "ext_front_cornering_lamp" },
{ "id": "66", "name": "ext_others" },
{ "id": "67", "name": "int_design_color" },
{ "id": "68", "name": "int_seat_upholstery" },
{ "id": "69", "name": "int_headrests" },
{ "id": "70", "name": "int_fuel_display" },
{ "id": "71", "name": "int_odometer" },
{ "id": "72", "name": "int_ac" },
{ "id": "73", "name": "int_ac_vents" },
{ "id": "74", "name": "int_steering_wheel" },
{ "id": "75", "name": "int_inside_door_handles" },
{ "id": "76", "name": "int_map_pockets" },
{ "id": "77", "name": "int_pass_seat_pockets" },
{ "id": "78", "name": "int_interior_lighting" },
{ "id": "79", "name": "int_armrests" },
{ "id": "80", "name": "int_foldable_seat" },
{ "id": "81", "name": "int_gear_lever" },
{ "id": "82", "name": "int_irvm" },
{ "id": "83", "name": "int_others" },
{ "id": "84", "name": "saf_airbags" },
{ "id": "85", "name": "saf_antilock_braking" },
{ "id": "86", "name": "saf_engine_immobilizer" },
{ "id": "87", "name": "saf_seat_belts" },
{ "id": "88", "name": "saf_seat_belt_reminder" },
{ "id": "89", "name": "saf_seat_belt_retractor" },
{ "id": "90", "name": "saf_rear_parking_aid" },
{ "id": "91", "name": "saf_perimeter_alarm" },
{ "id": "92", "name": "saf_electronic_stability" },
{ "id": "93", "name": "saf_traction_control" },
{ "id": "94", "name": "saf_hill_launch_assist" },
{ "id": "95", "name": "saf_crash_unlocking" },
{ "id": "96", "name": "saf_door_locks" },
{ "id": "97", "name": "saf_door_ajar_warning" },
{ "id": "98", "name": "saf_horn_type" },
{ "id": "99", "name": "saf_burglar_alarm" },
{ "id": "100", "name": "saf_child_seat" },
{ "id": "101", "name": "saf_high_speed_alert" },
{ "id": "102", "name": "saf_others" },
{ "id": "103", "name": "cnv_remote_keyless_entry" },
{ "id": "104", "name": "cnv_front_dome_lamp" },
{ "id": "105", "name": "cnv_welcome_lamp" },
{ "id": "106", "name": "cnv_tilt_steering" },
{ "id": "107", "name": "cnv_power_windows" },
{ "id": "108", "name": "cnv_boot_lamp" },
{ "id": "109", "name": "cnv_engine_start_button" },
{ "id": "110", "name": "cnv_auto_head_lamp" },
{ "id": "111", "name": "cnv_wipers" },
{ "id": "112", "name": "cnv_power_supply" },
{ "id": "113", "name": "cnv_boot_release" },
{ "id": "114", "name": "cnv_seat_height_adjust" },
{ "id": "115", "name": "cnv_key_system" },
{ "id": "116", "name": "cnv_paddle_shifter" },
{ "id": "117", "name": "cnv_footrest" },
{ "id": "118", "name": "cnv_dust_pollen_filter" },
{ "id": "119", "name": "cnv_power_steering" },
{ "id": "120", "name": "cnv_vanity_mirror" },
{ "id": "121", "name": "cnv_glove_box" },
{ "id": "122", "name": "cnv_rear_seat_split" },
{ "id": "123", "name": "cnv_central_locking" },
{ "id": "124", "name": "cnv_cruise_control" },
{ "id": "125", "name": "cnv_heat_rejection_glass" },
{ "id": "126", "name": "cnv_others" },
{ "id": "127", "name": "ent_vehicle_connectivity" },
{ "id": "128", "name": "ent_touchscreen" },
{ "id": "129", "name": "ent_navigation" },
{ "id": "130", "name": "ent_audio_system" },
{ "id": "131", "name": "ent_bluetooth" },
{ "id": "132", "name": "ent_speakers_tweeters" },
{ "id": "133", "name": "ent_microphone" },
{ "id": "134", "name": "ent_steering_mounted_control" },
{ "id": "135", "name": "ent_mobile_connectivity" },
{ "id": "136", "name": "ent_aux_in_usb" },
{ "id": "137", "name": "ent_remote_control" },
{ "id": "138", "name": "ent_others" },
{ "id": "139", "name": "ins_speedometer" },
{ "id": "140", "name": "ins_tachometer" },
{ "id": "141", "name": "ins_gear_shift_indicator" },
{ "id": "142", "name": "ins_cabin_lamp" },
{ "id": "143", "name": "ins_puddle_lamp" },
{ "id": "144", "name": "ins_front_map_lamp" },
{ "id": "145", "name": "ins_glove_box_illumination" },
{ "id": "146", "name": "ins_footwell_lighting" },
{ "id": "147", "name": "ins_tyre_pressure_monitor" },
{ "id": "148", "name": "ins_fuel_economy_indicator" },
{ "id": "149", "name": "ins_trip_meter" },
{ "id": "150", "name": "ins_fuel_indicator" },
{ "id": "151", "name": "ins_temperature_indicator" },
{ "id": "152", "name": "ins_cruising_range_indicator" },
{ "id": "153", "name": "ins_clock" },
{ "id": "154", "name": "ins_others" },
{ "id": "155", "name": "acc_battery" },
{ "id": "156", "name": "acc_others" },
{ "id": "157", "name": "pri_ex_showroom" },
{ "id": "158", "name": "pri_registration" },
{ "id": "159", "name": "pri_road_tax" },
{ "id": "160", "name": "pri_insurance" },
{ "id": "161", "name": "pri_tcs_fasttag" },
{ "id": "162", "name": "pri_accesories" },
{ "id": "163", "name": "pri_on_road" },
{ "id": "164", "name": "mis_delivery" },
{ "id": "165", "name": "mis_waiting_period" },
{ "id": "166", "name": "mis_servicing" },
{ "id": "167", "name": "mis_financing" }
];

export default Dashboard;
