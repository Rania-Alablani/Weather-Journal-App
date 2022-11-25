projectData = {};

// Require Express to run server and routes
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static("website"));

// Callback function to complete GET '/all'
const getAll = (req, res) => res.status(200).send(projectData);
// GET Route
app.get("/all", getAll);

// Callback function to complete POST '/add'
const postData = (req, res) => {
    projectData = req.body;
    console.log(projectData);
  }

app.post("/add", postData);

const port = 4000;

// function to test the server
const listening = () =>
console.log(`Server running at http://localhost:${port}/`);

// spin up the server
app.listen(port, listening);
