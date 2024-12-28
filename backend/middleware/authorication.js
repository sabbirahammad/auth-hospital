const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Assuming "Bearer <token>"
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sabbir');
        req.user = decoded; // Attach the decoded token data (e.g., email) to the request object
        next();
    } catch (error) {
        return res.status(402).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = authAdmin;


