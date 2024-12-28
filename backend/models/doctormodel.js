const mongoose = require('mongoose');

// Define address as a sub-schema if it has multiple fields
const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
}, { _id: false });

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
       
    },
    speciality: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    experience: {  
        type: Number, // Changed to Number if it represents years of experience
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    date: {
        type: Date,  // Use Date type for better timestamp handling
        required: true,
    },
    slots_booked: {
        type: [String],  // Use an array to hold booked slots
        default: [],
    },
}, { minimize: false });

const doctorModel = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

module.exports = doctorModel;
