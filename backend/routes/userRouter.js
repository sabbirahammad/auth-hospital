const express = require('express');
const { userRegister, userlogin, getprofile, updateProfile, bookappointment,listappointment, cancleAppointment, paymentrazorpay, verifyrazorpay } = require('../controller/usercontroller');
const authuser = require('../middleware/authuser'); // Auth middleware
const upload = require('../middleware/multer');

const userrouter = express.Router();

// Auth routes
userrouter.post('/register', userRegister);
userrouter.post('/login', userlogin);

// Profile routes
userrouter.get('/get-profile', authuser, getprofile); 
userrouter.post('/profile-update',upload.single('image'), authuser, updateProfile);
userrouter.post('/book-appointment',authuser,bookappointment)
userrouter.get('/appointments', authuser, listappointment);
userrouter.post('/cancelappointment',authuser,cancleAppointment)
userrouter.post('/payment', authuser, paymentrazorpay);
userrouter.post('/razorpayverify',authuser,verifyrazorpay)



module.exports = userrouter;
