const mongoose = require('mongoose');
const db_url = "mongodb://localhost:27017/sabbir";
// const db_url=process.env.MONGODB

const mongoConnected = async () => {
    try {
        await mongoose.connect(db_url);
        console.log("DB is connected");
    } catch (error) {
        console.error("DB is not connected", error);
    }
};

module.exports = mongoConnected;
