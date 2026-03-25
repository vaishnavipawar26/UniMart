import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { getToken } from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
  try {
    console.log(" Signup data received:", req.body);

    const { fullName, email, password, mobile, role, shopType } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (mobile.length < 10)
      return res.status(400).json({ message: "Mobile number must be at least 10 digits" });

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already exists." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = await User.create({
      fullName,
      email,
      role,
      mobile,
      password: hashedPassword,
      shopType: "" , 
    });

    // Generate token & set cookie
    const token = await getToken(user._id);
    res.cookie("token", token, {
      secure: false,
    sameSite: "lax",
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });
    
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};


export const signIn = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = await getToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 1000,
            httpOnly: true
        });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(`sign in error ${error}`);
        
    }
};

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json(`sign out error ${error}`);
    }
};

export const sendOtp=async (req,res)=>{
    try{
        const {email}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }
        const otp=Math.floor(1000 + Math.random() * 9000).toString()
        console.log(` Generated OTP for ${email}: ${otp}`); 
        user.resetOtp=otp
        user.otpExpires=Date.now()+5*60*1000
        user.isOtpVerified=false
        await user.save()
        await sendOtpMail(email,otp)
        return res.status(200).json({message:"otp send successfully"})
        }catch(error){
            return res.status(500).json(`send otp error ${error}`)
        }
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Verify OTP error: ${error.message}` });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Reset password error: ${error.message}` });
  }
};

export const googleAuth=async (req,res) =>{
    try{
        const {fullName,email,mobile,role}=req.body
        let user=await User.findOne({email})
        if(!user){
            user=await User.create({
                fullName,email,mobile,role,
            })
        }
        const token = await getToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 1000,
            httpOnly: true
        });
            res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json(`GoogleAuth error ${error}`);
    }
}
