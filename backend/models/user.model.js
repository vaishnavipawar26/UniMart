import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,  
    },
    mobile:{
        type: String,
        required: true,
    },
    role:{
        type:String,
        enum:["student","vendor","delivery"],
        required: true,
    },
    resetOtp:{
        type:String
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    },
    otpExpires:{
        type:Date 
    } , 
    shopType: {
      type: String,
      enum: ["canteen", "stationery", "print", ""],
      default: "",
    },
    socketId:{
        type:String,
    },
    isOnline:{
        type:Boolean,
        default:false,
    },

},{timestamps:true})

const User=mongoose.model("User",userSchema)
export default User
