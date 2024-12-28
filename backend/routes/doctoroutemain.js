// doctorRoute.js
const express = require("express");
const { doctorlist } = require("../controller/doctorconroller.");



const doctorRoute = express.Router();

doctorRoute.get("/list",doctorlist); // Correctly passing the callback

module.exports = doctorRoute; // Use CommonJS syntax

