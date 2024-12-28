require('dotenv').config(); // Load environment variables
const fs = require('fs');
const path = require('path');
const validator = require('validator'); // For validation
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For token generation
const doctorModel = require('../models/doctormodel'); // Doctor model

// Add Doctor
const adddoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imagefile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imagefile) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format." });
        }

        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(409).json({ success: false, message: "Email is already in use." });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare image path relative to the server's public URL
        const imagePath = `uploads/${imagefile.filename}`;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imagePath, // Use the relative path
            speciality,
            degree,
            experience: parseInt(experience, 10),
            about,
            fees: parseFloat(fees),
            address: typeof address === 'string' ? JSON.parse(address) : address,
            date: new Date(),
        };

        await new doctorModel(doctorData).save();
        res.status(201).json({ success: true, message: "Doctor added successfully." });
    } catch (error) {
        console.error("Error in adddoctor:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Admin Login
const loginadmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if user exists
        const user = await doctorModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'sabbir', { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Error in loginadmin:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get All Doctors
const alldoctor = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.status(200).json({ success: true, doctors });
    } catch (error) {
        console.error('Error in alldoctor:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { adddoctor, loginadmin, alldoctor };

