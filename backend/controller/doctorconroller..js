// Using CommonJS require and module.exports
const doctorModel = require("../models/doctormodel");

const changeAvailability = async (req, res) => {
  try {
    const { docid } = req.body; // Assuming docid is sent in the request body

    // Find the doctor by ID
    const doctor = await doctorModel.findById(docid);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Update availability
    doctor.available = !doctor.available;
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Availability changed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};


const doctorlist = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.status(201).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

module.exports = { changeAvailability,doctorlist };
