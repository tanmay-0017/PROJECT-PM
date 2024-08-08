import { StatusCodes } from "http-status-codes";
import { Admin } from "../Models/adminModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


export const createAdmin = async (req, res) => {
  try {
    const { email, password, role, ...otherData } = req.body;

    if (!password || password.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password is required" });
    }

    // Check if Admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword, role, ...otherData });
    await newAdmin.save();

    res.status(StatusCodes.CREATED).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error in createAdmin:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email, password, and role are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email" });
    }

    if (admin.role !== role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role" });
    }

    const isPasswordValid = bcrypt.compareSync(password, admin.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ adminEmail: admin.email, role: admin.role }, "secret1234");
    return res.status(StatusCodes.OK).json({ message: "Login successful", token, role: admin.role });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred, please try again later." });
  }
};



// Generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  try {
    let config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }

    }
    const transporter = nodemailer.createTransport(config);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `Your OTP for password reset is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
    

  } catch (error) {
    console.error("Error in sendOTPEmail:", error);
    throw new Error("Failed to send OTP email");

  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Admin with this email does not exist" });
    }

    const otp = generateOTP();
    admin.resetOTP = otp;
    admin.resetOTPExpiry = Date.now() + 3600000; // 1 hour expiry
    await admin.save();

    console.log("otp", otp);
    // Send OTP via email
    await sendOTPEmail(email, otp);



    res.status(StatusCodes.OK).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred, please try again later." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Admin not found" });
    }

    if (admin.resetOTP !== otp || admin.resetOTPExpiry < Date.now()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired OTP" });
    }

    res.status(StatusCodes.OK).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred, please try again later." });
  }
};

export const setNewPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Passwords do not match" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Admin not found" });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin's password and clear the OTP fields
    admin.password = hashedPassword;
    admin.resetOTP = null;
    admin.resetOTPExpiry = null;

    await admin.save();

    res.status(StatusCodes.OK).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in setNewPassword:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred, please try again later." });
  }
};




export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, role, ...otherData } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Admin not found" });
    }

    if (email) admin.email = email;
    if (role) admin.role = role;
    if (password) {
      if (!password.trim()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password cannot be empty" });
      }
      admin.password = bcrypt.hashSync(password, 10);
    }
    Object.assign(admin, otherData);

    await admin.save();

    res.status(StatusCodes.OK).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error("Error in updateAdmin:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Admin not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAdmin:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

export const deleteAllAdmins = async (req, res) => {
  try {
    await Admin.deleteMany();

    res.status(StatusCodes.OK).json({ message: "All admins deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAllAdmins:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};













