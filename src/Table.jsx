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
    };
  }

  componentDidMount() {
    this.ExtractData();
    var keyCarObject = Object.keys(CarsDataJSON[0]);
    console.info(keyCarObject);
    this.renderColumnCarMetadata(keyCarObject);
  }

  async fetchCsv() {
    const response = await fetch('data/sample.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result.value);
    console.log('csv', csv);
    return csv;
  }

  renderRowData() {
    return (
      <>
        <td>{}</td>
        <td>6</td>
        <td>midfielder</td>
        <td>83</td>
        <td>6</td>
        <td>11</td>
      </>
    );
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
        {/* {this.state.tabledata && this.state.tabledata.length > 0 && (
          <div className="">
            <table
              className="table w-full h-screen"
              style={{ border: '1px solid black' }}
            >
              {this.state.tabledata.map((item, index) => {
                return (
                  <tr style={{ border: '1px solid black' }}>
                    <>
                      {index === 2 ? (
                        <td colSpan={24} style={{ backgroundColor: 'gray' }}>
                          EmtpyRow sfv ext-sm font-medium text-gray-900
                          whitespace-nowrap dark:text-gray-600{' '}
                        </td>
                      ) : (
                        <>
                          {item.map((cell) => (
                            <td> {cell}</td>
                          ))}
                        </>
                      )}
                    </>
                  </tr>
                );
              })}
            </table>
          </div>
        )} */}
        <div className="tableContainer">
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
          {/* <table id="vertical-1">
            <caption>First Way</caption>
            <tr>
              <th>Header 1</th>
              <td>data</td>
              <td>data</td>
              <td>data</td>
            </tr>
            <tr>
              <th>Header 2</th>
              <td>data</td>
              <td>data</td>
              <td>data</td>
            </tr>
            <tr>
              <th>Header 2</th>
              <td>data</td>
              <td>data</td>
              <td>data</td>
            </tr>
          </table> */}
        </div>
      </>
    );
  }
}

export default TableCar;
