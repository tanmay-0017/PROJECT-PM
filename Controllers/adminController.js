import { StatusCodes } from "http-status-codes";
import { Admin } from "../Models/adminModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Middleware to verify JWT token
export function verifyToken(request, response, next) {
  const header = request.get('Authorization');
  if (header) {
    const token = header.split(" ")[1];
    jwt.verify(token, "secret1234", (error, payload) => {
      if (error) {
        return response.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid token" });
      } else {
        next();
      }
    });
  } else {
    return response.status(StatusCodes.UNAUTHORIZED).send({ message: "Please login first" });
  }
}

export const createAdmin = async (req, res) => {
  try {
    const { email, password, ...otherData } = req.body;

    if (!password || password.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password is required" });
    }

    // Check if Admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword, ...otherData });
    await newAdmin.save();

    res.status(StatusCodes.CREATED).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error in createAdmin:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (admin) {
      const isPasswordValid = bcrypt.compareSync(password, admin.password);
      if (isPasswordValid) {
        const token = jwt.sign({ adminEmail: admin.email }, "secret1234");
        return res.status(StatusCodes.OK).json({ message: "Login successful", token });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid password" });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email" });
    }
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
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    secure: true,
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST

  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
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

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(StatusCodes.OK).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred, please try again later." });
  }
};



export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, ...otherData } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Admin not found" });
    }

    if (email) admin.email = email;
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










