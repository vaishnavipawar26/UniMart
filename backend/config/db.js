import mongoose from "mongoose";

const ConnectDb= async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected")
    }catch (error){
        console.log(" db error" , error)
    }
}

export default ConnectDb
