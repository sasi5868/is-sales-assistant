import React, { Component } from 'react';

import Papa from 'papaparse';

import './Table.css';

import CarsDataJSON from './data/cars_array_final';

class TableCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabledata: [],
      tableCarArray: [],
      carsShow:[],
      carsHighlight:[]
    };
  }



  componentDidMount() {
    this.ExtractData();
    var keyCarObject = Object.keys(CarsDataJSON[0]);
    console.info(keyCarObject);
    this.renderColumnCarMetadata(keyCarObject);


    console.info(`The value of the Table State in ${this.state.carsShow}  && ${this.state.carsHighlight}`)
  }

  updateTableData(cardata,carhighlight){
    let theUpdatedCarTable = this.state.carsShow.filter(val=>{
            cardata.includes(val.mod_variants)
    })

    this.setState({tabledata:theUpdatedCarTable})
  }


  // static getDerivedStateFromProps(nextProps,PrevState){
  //   if(nextProps.carsShow !== PrevState.carsShow){
  //     return ({carsShow:nextProps.carsShow})
  //   } 

  //   if(nextProps.rowsHighlight !== PrevState.rowsHighlight){
  //     return ({carsHighlight:nextProps.rowsHighlight})
  //   }

  //   // Once the component updates change the value of the state table data
  //   this.updateTableData(this.state.carsShow,this.state.carsHighlight)
    
  // }

  componentDidUpdate(prevProps) {
    if(prevProps.carsShow!== this.props.carsShow){
      this.setState({
        carsShow: this.props.CarToShow
      })
    }

    if(prevProps.rowsHighlight!== this.props.rowsHighlight){
      this.setState({
        carsHighlight: this.props.RowsToHighlight
      })

      
    }

  }




  componentWillUnmount(){
    this.setState({
      tabledata: [],
      tableCarArray: [],
      carsShow:[],
      carsHighlight:[]
    })
  }

  ExtractData() {
    // const csvData = Papa.parse(await this.fetchCsv());
    // console.log(csvData);

    this.setState({ tabledata: CarsDataJSON });
    // console.log(this.state.tabledata);
  }

  renderHead(headValue) {
    return (
      <>
        <th>{headValue}</th>
      </>
    );
  }


  renderColumnCarMetadata(carMetadataArray) {
    this.setState({ tableCarArray: carMetadataArray });
  }

  rowHeaderRestBody(dataHeader) {
    return this.state.tabledata.map((valObj) => {
      // console.info(valObj[dataHeader]);
      return <td>{valObj[dataHeader]}</td>;
    });
  }

  render() {
    return (
      <>
     
        <div key="childComponent" className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Car Model</th>
                {this.state.tabledata.length > 0 &&
                  this.state.tabledata.map((val) =>
                    this.renderHead(val.mod_variants)
                  )}
              </tr>
            </thead>

            <tbody>
              {this.state.tableCarArray.map((rowHeader) => {
                return (
                  <tr>
                    <td>{rowHeader}</td>
                    {/* {this.rowHeaderRestBody(rowHeader)} */}
                    {this.rowHeaderRestBody(rowHeader)}
                  </tr>
                );
              })}
            </tbody>
          </table>
         
        </div>
      </>
    );
  }
}

export default TableCar;
