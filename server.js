projectData = {};

const port = 3000;
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Main project folder
app.use(express.static("website"));

// Test the server
const listening = () =>
console.log(`Running at http://localhost:${port}/`);

// Spin up the server
app.listen(port, listening);

// Callback function to complete GET '/all'
const getAll = (req, res) => res.status(200).send(projectData);
app.get("/all", getAll);

// Callback function to complete POST '/add'
const postData = (req, res) => {
    projectData = req.body;
    console.log(projectData);
  }
app.post("/add", postData);
