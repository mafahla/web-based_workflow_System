import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
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
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function App() {
  const [items, setItems] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [customer, setCustomer] = useState([]);
  const [loader, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birth: "",
  });

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

  const Income = items.map((item) => item.Income);
  const Month = items.map((item) => item.Month);
  const Expenses = items.map((item) => item.Expenses);

  console.log(
    items.map((item) => item.Income),
    "items"
  );

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    console.log(formData);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:1337/api/customers", { data: formData })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setLoading(false);
    axios
      .get("http://localhost:1337/api/customers?populate=*")
      .then((response) => {
        setLoading(true);
        setCustomer(response.data.data);
        console.log(response.data.data);
        setData(customer[0].attributes.excel.data.attributes.name);
      })
      .catch((error) => {
        console.log(error);
        setLoading(true);
      });
  }, []);

  return (
    
    <div>
      <Form className="form" onClick={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              className="control"
              placeholder="First name"
              type="text"
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
            />
          </Col>
          <Col>
            <Form.Control
              className="control"
              placeholder="Last name"
              type="text"
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Control
              className="control"
              type="date"
              name="birth"
              onChange={handleChange}
              value={formData.birth}
            />
          </Col>
          <Col>
            <Button className="control" variant="success">
              Add New
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Excel Upload</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loader &&
            customer.map((cust) => (
              <tr key={cust.id}>
                <td>{cust.attributes.firstName}</td>
                <td>{cust.attributes.lastName}</td>
                <td>{cust.attributes.birth}</td>
                <td>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      readExcel(file);
                    }}
                  />
                </td>
                <td>
                  <Button variant="primary" onClick={handleShow1}>
                    View Graph
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal
        style={{ width: "100rem" }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show1}
        onHide={handleClose1}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Graph</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

            <LineChart width={700} height={600} data={items}>
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
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

// Graduate2023
export default App;
