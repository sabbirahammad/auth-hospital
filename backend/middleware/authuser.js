const jwt = require('jsonwebtoken');

const authuser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // Get token from Authorization header
        if (!authHeader) {
            return res.status(400).json({
                success: false,
                message: 'Token is missing. Please log in again.',
            });
        }

        const token = authHeader.split(' ')[1]; // Assuming "Bearer <token>" format
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token format is invalid.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sabbir');
        req.body.userId = decoded.id; // Attach decoded userId to request body
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(401).json({
            success: false,
            message: 'Authentication failed. ' + error.message,
        });
    }
};

module.exports = authuser;

// const jwt = require("jsonwebtoken");

// const authuser = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };

// module.exports = authuser;






