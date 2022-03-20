import React, { Component } from "react";

import Papa from "papaparse";

class TableCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabledata: [],
    };
  }

  componentDidMount() {
    this.ExtractData();
  }

  async fetchCsv() {
    const response = await fetch("data/sample.csv");
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csv = await decoder.decode(result.value);
    console.log("csv", csv);
    return csv;
  }

  async ExtractData() {
    const csvData = Papa.parse(await this.fetchCsv());
    console.log(csvData);
    this.setState({ tabledata: csvData.data });
  }

  render() {
    return (
      <>
        {this.state.tabledata && this.state.tabledata.length > 0 && (
          <div className=""   >
            <table className="table w-full h-screen" style={{ border: "1px solid black" }}>
              {this.state.tabledata.map((item, index) => {
                return (
                  <tr style={{ border: "1px solid black" }}>
                      <>
            
                    {index === 2 ? (
                      <td colSpan={24} style={{ backgroundColor: "gray" }}>
                        EmtpyRow sfv ext-sm font-medium text-gray-900
                        whitespace-nowrap dark:text-gray-600{" "}
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
        )}
      </>
    );
  }
}

export default TableCar;
