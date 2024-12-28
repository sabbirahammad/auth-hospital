const express = require('express');
const multerupload = require('../middleware/multer'); // Multer middleware for file upload
const { adddoctor, loginadmin, alldoctor } = require('../controller/doctorcon'); // Import controllers
const authAdmin = require('../middleware/authorication'); // Import authorization middleware
const { changeAvailability } = require('../controller/doctorconroller.');


const adminRouter = express.Router();

// Routes
adminRouter.post('/add-doctor', multerupload.single('docemg'), adddoctor);
adminRouter.post('/login', loginadmin);
adminRouter.post('/all-doctors', authAdmin, alldoctor);
adminRouter.post('/change-availablity',authAdmin,changeAvailability)

module.exports = adminRouter;


