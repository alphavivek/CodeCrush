const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://vivekkumarpathak098:r2VLIY9bSFU32GoT@codecrush.dtj2e.mongodb.net/CodeTinder");
    // await mongoose.connect("mongodb+srv://vivekkumarpathak098:r2VLIY9bSFU32GoT@codecrush.dtj2e.mongodb.net/DevTinder");
}

module.exports = connectDB ;