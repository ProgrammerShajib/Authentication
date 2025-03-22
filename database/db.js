require("dotenv").config()
const mongoose = require("mongoose")


const URL = process.env.URL;
 
const connectDB = async ()=>{
    try {
        await mongoose.connect(URL).then().catch()
        console.log(`MongoDb is connected successfully!`)
    } catch (error) {
        console.log(`MongoDb connection is failed!`)
        process.exit(1);
    }
}


module.exports = connectDB;

