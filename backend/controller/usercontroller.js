const validate = require('validator');
const bcrypt = require('bcrypt');
const userModel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctormodel');
const appointmentmodel = require('../models/appointmentmodel');
const Razorpay = require('razorpay');
require('dotenv').config();
const axios = require('axios');

// API to register a user
const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing details
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing details',
      });
    }

    // Validate email
    if (!validate.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      password: hash,
    };

    // Save new user
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'FOADHJQHTH',
      { expiresIn: '1d' } // Token expires in 1 day
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

// API for user login
const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      });
    }

    // Compare the provided password with the stored hashed password
    const passCompare = await bcrypt.compare(password, user.password);

    if (passCompare) {
      // Generate a JWT token upon successful login
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'sabbir',
        { expiresIn: '1d' } // Token expires in 1 day
      );

      return res.status(200).json({
        success: true,
        token,
      });
    } else {
      // Invalid password
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

// API to get user data
const getprofile = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const userdata = await userModel.findById(userId).select('-password');

    // Check if user exists
    if (!userdata) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      userdata,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !phone || !dob || !gender || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, name, phone, dob, or gender',
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updateData = {
      name,
      phone,
      gender,
      dob,
      address: address ? JSON.parse(address) : user.address,
      image: image || user.image,
    };

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// API to book appointment
const bookappointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    if (!userId || !docId || !slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, docId, slotDate, or slotTime',
      });
    }

    // Fetch doctor data
    const doctor = await doctorModel.findById(docId).select('-password');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (!doctor.available) {
      return res.status(400).json({ success: false, message: 'Doctor is not available' });
    }

    // Check slot availability
    const slotsBooked = doctor.slots_booked || {};
    if (slotsBooked[slotDate]?.includes(slotTime)) {
      return res.status(400).json({ success: false, message: `Slot ${slotTime} on ${slotDate} is already booked. Please choose a different slot.` });
    }

    // Update slotsBooked
    if (!slotsBooked[slotDate]) {
      slotsBooked[slotDate] = [];
    }
    slotsBooked[slotDate].push(slotTime);

    // Fetch user data
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create appointment data
    const appointmentData = {
      userId,
      docId,
      userdata: user,
      docdata: doctor,
      amount: doctor.fees,
      slotTime,
      slotDate,
      date: Date.now(),
      status: 'pending', // Track appointment status
    };

    // Save new appointment
    const newAppointment = new appointmentmodel(appointmentData);
    await newAppointment.save();

    // Update doctor slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    return res.status(200).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: newAppointment,
    });
  } catch (error) {
    console.error('Error booking appointment:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// API to list appointments
const listappointment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const appointments = await appointmentmodel.find({ userId });
    if (!appointments.length) {
      return res.status(404).json({
        success: false,
        message: 'No appointments found',
      });
    }

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// API to cancel appointment
const cancleAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    // Find appointment data
    const appointmentData = await appointmentmodel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Verify appointment user
    if (String(appointmentData.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized action',
      });
    }

    // Cancel the appointment
    await appointmentmodel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    let slotsBooked = doctorData.slots_booked || {};
    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = slotsBooked[slotDate].filter((e) => e !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res.json({
      success: true,
      message: 'Appointment canceled successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// API for Razorpay payment
// API for Razorpay payment
// API for Razorpay payment
// API for Razorpay payment

require("dotenv").config(); // To load the environment variables

// Initialize Razorpay instance with keys
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID||"your_razorpay_key_id",
  key_secret: process.env.RAZORPAY_SECRET_KEY||"your_razorpay_secret_key",
});

const paymentrazorpay = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;

    if (!appointmentId || !userId) {
      return res.status(400).json({ success: false, message: 'Missing required fields: appointmentId or userId' });
    }

    // Fetch the user and appointment details
    const user = await userModel.findById(userId);
    const appointment = await appointmentmodel.findById(appointmentId);

    if (!appointment || !user) {
      return res.status(400).json({ success: false, message: 'Invalid appointment or user' });
    }

    if (String(appointment.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this appointment' });
    }

    // Razorpay order options
    const options = {
      amount: appointment.amount * 100,  // Amount in paise
      currency: 'INR',
      receipt: `receipt_${appointment._id}`,
      notes: {
        appointmentId: appointment._id,
      },
    };
    
    

    // Attempt to create Razorpay order
    const order = await razorpayInstance.orders.create(options);
    console.log(order)

    if (!order || !order.id) {
      return res.status(500).json({ success: false, message: 'Error creating Razorpay order' });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error during payment creation:', error);  // Log the error for more insight
    return res.status(500).json({
      success: false,
      message: `Server error during payment creation: ${error.message || error}`,  // Pass the error message
    });
  }
};




// API to verify Razorpay payment
const verifyrazorpay = async (req, res) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  
      console.log("Received Payment Details:", { razorpayOrderId, razorpayPaymentId, razorpaySignature });
  
      // Verify the payment signature
      const generatedSignature = razorpayInstance.crypto.verifyPaymentSignature({
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
      });
  
      console.log("Generated Signature:", generatedSignature);
  
      if (generatedSignature === razorpaySignature) {
        // Update the appointment with payment status
        await appointmentmodel.findByIdAndUpdate(razorpayOrderId, { payment: true }, { new: true });
        return res.json({
          success: true,
          message: 'Payment verified successfully',
        });
      } else {
        console.error('Signature mismatch');
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed',
        });
      }
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  };
  

module.exports = {
  userRegister,
  userlogin,
  getprofile,
  updateProfile,
  bookappointment,
  listappointment,
  cancleAppointment,
  paymentrazorpay,
  verifyrazorpay,
};
