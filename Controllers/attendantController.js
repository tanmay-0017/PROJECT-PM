import Attendant from "../Models/Attendant.js";
import asyncHandler from "../utils/asyncHandler.js";
import nodemailer from 'nodemailer';

/*
export const createAttendant = asyncHandler(async (req, res) => {
  const { name, status, team, email, project, phone } = req.body;

  const lastemployee = await Attendant.findOne().sort({ $natural: -1 });
  let employeeId;

  if (lastemployee && lastemployee.employeeId) {
    const lastemployeeIdNum = parseInt(lastemployee.employeeId.substring(5));
    employeeId = `ROFEX${(lastemployeeIdNum + 1).toString()}`;
  } else {
    employeeId = "ROFEX1";
  }

  Attendant.create(
    {
      name,
      status,
      team,
      employeeId,
      email,
      project,
      phone,
    },
    { new: true }
  );
  res.status(201).json({
    name,
    status,
    team,
    employeeId,
    email,
    project,
    phone,
  });
});
*/

const generateRandomPassword = () => {
  const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();
  return `Rof@${randomNumbers}`;
};

const sendEmail = async (email, password) => {

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
    from: 'process.env.EMAIL_USER',
    to: email,
    subject: 'Your Account Details',
    text: `Your account has been created. Your credentials are:\n\nLogin ID: ${email}\nPassword: ${password}`,
  };

  await transporter.sendMail(mailOptions);
};


export const createAttendant = asyncHandler(async (req, res) => {
  const { name, status, team, email, project, phone } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Name and email are required fields." });
  }


  const existingAttendant = await Attendant.findOne({ email });
  if (existingAttendant) {
    return res
      .status(400)
      .json({ message: "An account with this email already exists." });
  }

  const defaultPassword = generateRandomPassword();


  const lastemployee = await Attendant.findOne().sort({ $natural: -1 });
  let employeeId;

  if (lastemployee && lastemployee.employeeId) {
    const lastemployeeIdNum = parseInt(lastemployee.employeeId.substring(5));
    employeeId = `ROFEX${(lastemployeeIdNum + 1).toString()}`;
  } else {
    employeeId = "ROFEX1";
  }

  const newAttendant = new Attendant({
    name,
    status,
    team,
    employeeId,
    email,
    project,
    phone,
    password: defaultPassword

  });

  try {
    await sendEmail(email, defaultPassword);
    const savedAttendant = await newAttendant.save();
    res.status(201).json(savedAttendant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getAttendants = asyncHandler(async (req, res) => {
  const attendants = await Attendant.find();
  res.status(200).json(attendants);
});

export const getAttendantById = asyncHandler(async (req, res) => {
  const registeredAttendant = await Attendant.findById(req.params.id);
  if (!registeredAttendant)
    return res.status(404).json({ message: "Attendant not found" });
  res.status(200).json(registeredAttendant);
});

export const makeAttendantAvailable = asyncHandler(async (req, res) => {
  const attendant = await Attendant.findByIdAndUpdate(
    req.params.id,
    {
      $set: { status: "available" },
    },
    { new: true, runValidators: true }
  );
  if (!attendant)
    return res.status(404).json({ message: "Attendant not found" });
  res.status(200).json(attendant);
});

export const makeAllAttendantsAvailable = asyncHandler(async (req, res) => {
  const result = await Attendant.updateMany(
    { status: "assigned" },
    { $set: { status: "available" } },
    { runValidators: true }
  );

  if (result.nModified === 0) {
    return res.status(404).json({ message: "No attendants were updated" });
  }

  res.status(200).json({
    message: "All attendants are now available",
    modifiedCount: result.nModified,
  });
});

export const updateAttendant = asyncHandler(async (req, res) => {
  const { name, status, team } = req.body;
  const attendant = await Attendant.findByIdAndUpdate(
    req.params.id,
    { name, status, team },
    { new: true, runValidators: true }
  );
  if (!attendant)
    return res.status(404).json({ message: "Attendant not found" });
  res.status(200).json(attendant);
});

export const deleteAttendant = asyncHandler(async (req, res) => {
  const attendant = await Attendant.findByIdAndDelete(req.params.id);
  if (!attendant)
    return res.status(404).json({ message: "Attendant not found" });
  res.status(200).json({ message: "Attendant deleted" });
});

export const addTeamMember = asyncHandler(async (req, res) => {
  const { employeeId, email, name, team, project } = req.body;
  const teamMember = await Attendant.findOne({ employeeId: employeeId });
  console.log("teamMember", teamMember);
  const assignedTeamMember = await Attendant.findByIdAndUpdate(
    teamMember._id,
    {
      team,
      project,
    },
    { new: true }
  );

  console.log(assignedTeamMember);

  return res.status(200).json(assignedTeamMember);
});
