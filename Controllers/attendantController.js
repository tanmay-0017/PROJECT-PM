import Attendant from "../Models/Attendant.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createAttendant = asyncHandler(async (req, res) => {
  const { name, status, team, emailID, project } = req.body;

  const lastemployee = await Attendant.findOne().sort({ $natural: -1 });
  let employeeId;

  if (lastemployee && lastemployee.employeeId) {
    const lastemployeeIdNum = parseInt(lastemployee.employeeId.substring(5));
    employeeId = `ROFEX${(lastemployeeIdNum + 1).toString()}`;
  } else {
    employeeId = "ROFEX1";
  }

  Attendant.create({
    name,
    status,
    team,
    employeeId,
    emailID,
    project,
  });
  res.status(201).json({
    name,
    status,
    team,
    employeeId,
    emailID,
    project,
  });
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
