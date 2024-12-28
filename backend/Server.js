const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('./config/mongodb');
const path = require('path');
const adminRouter = require('./routes/doctorroute');
const doctorRoute = require('./routes/doctoroutemain');
const userrouter = require('./routes/userRouter');
const config = require('dotenv').config();

// App config
const app = express();
const port = process.env.PORT || 4000;
mongoose();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads folder

// API endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRoute);
app.use('/api/user',userrouter)

// Root endpoint
app.get('/', (req, res) => {
  res.send('API WORKING');
});

// Start the server
app.listen(port, () => {
  console.log("Server is running on port", port);
});


