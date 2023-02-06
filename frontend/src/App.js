import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";
import "./App.css";
import * as XLSX from "xlsx";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import Table from "./Components/Table"

function App() {
  const [items, setItems] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      console.log(d);
      setItems(d);
    });
  };

  console.log(
    items.map((item) => item.Income),
    "items"
  );

  const Income = items.map((item) => item.Income);
  const Month = items.map((item) => item.Month);
  const Expenses = items.map((item) => item.Expenses);
  

  return (
    <div>
      <Form>
        <Row>
          <Col>
            <Form.Control placeholder="First name" />
          </Col>
          <Col>
            <Form.Control placeholder="Last name" />
          </Col>
        </Row>
        <input
          type="date"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}
        />
      </Form>

      <div className="toka">
        <Table striped bordered hover style={{ width: "500px" }}>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Income</th>
              <th scope="col">Expenses</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id}>
                <th>{d.Month}</th>
                <td>{d.Income}</td>
                <td>{d.Expenses}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <LineChart width={1100} height={600} data={items}>
          <Line
            type="monotone"
            dataKey="Income"
            stroke="#2196F3"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="Expenses"
            stroke="#F44236"
            strokeWidth={3}
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="Month" />
          <YAxis />
          <Tooltip />
          <Legend />
        </LineChart>
      </div>





    </div>
  );
}

export default App;
