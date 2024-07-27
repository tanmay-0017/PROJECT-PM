import asyncHandler from "../utils/asyncHandler.js";
import Attendant from "../Models/Attendant.js";

export const acceptClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const updatedAttendant = await Attendant.findByIdAndUpdate(
    attendant._id,
    {
      "ClientName.$[].accepted": "accepted",
    },
    { new: true }
  );

  res.status(200).json(updatedAttendant);
});

export const rejectClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const updatedAttendant = await Attendant.findByIdAndUpdate(
    attendant._id,
    {
      "ClientName.$[].accepted": "rejected",
    },
    { new: true }
  );

  res.status(200).json(updatedAttendant);
});

export const attendantMeetingOver = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const updatedAttendant = await Attendant.findByIdAndUpdate(
    attendant._id,
    {
      endTime: Date.now(),
      "ClientName.$[].completed": "completed",
      status: "available",
    },
    { new: true }
  );

  res.status(200).json(updatedAttendant);
});

export const upcomingAppointments = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const upcomingAppointments = attendant.ClientName.filter(
    (log) => log.completed === "progress"
  );

  res.status(200).json(upcomingAppointments);
});

export const getClientHistory = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  if (!attendant) {
    return res.status(404).json({ message: "Attendant not found" });
  }

  const clientHistory = attendant.ClientName;
  res.status(200).json(clientHistory);
});
