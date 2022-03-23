import React, {useEffect,useState} from 'react'

import './Table.css'

import CarsDataJSON from './data/cars_array_final';

const TableMod = ({carsShow,rowsHighlight}) => {
    const [tabledata,setTableData] = useState([])
    const [tableCarArray,setTableCarArray] = useState([])
    const [carsShowArray,setCarsShow] = useState([])
    const [carsHighlight,setCarsHighlight] = useState([])


    useEffect(()=>{
        ExtractData();
    var keyCarObject = Object.keys(CarsDataJSON[0]);
    // console.info(keyCarObject);
    renderColumnCarMetadata(keyCarObject);
    },[])

   const  ExtractData=()=> {
        // const csvData = Papa.parse(await this.fetchCsv());
        // console.log(csvData);
    
     setTableData(CarsDataJSON);
        // console.log(this.state.tabledata);
      }

    const renderHead=(headValue)=> {
        return (
          <>
            <th>{headValue}</th>
          </>
        );
      }

    const renderColumnCarMetadata=(carMetadataArray)=> {
        setTableCarArray(carMetadataArray)
        // this.setState({ tableCarArray: carMetadataArray });
      }

    const rowHeaderRestBody=(dataHeader)=> {
        return this.state.tabledata.map((valObj) => {
          // console.info(valObj[dataHeader]);
          return <td>{valObj[dataHeader]}</td>;
        });
      }

return (
    <>

    <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th>Car Model</th>
            {tabledata.length > 0 &&
              tabledata.map((val) =>
                renderHead(val.mod_variants)
              )}
          </tr>
        </thead>

        <tbody>
          {tableCarArray.map((rowHeader) => {
            return (
              <tr>
                <td>{rowHeader}</td>
                {/* {this.rowHeaderRestBody(rowHeader)} */}
                {rowHeaderRestBody(rowHeader)}
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
    </>
)
}

export default TableMod