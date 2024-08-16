import asyncHandler from "../utils/asyncHandler.js";
import Attendant from "../Models/Attendant.js";
import Customer from "../Models/customer.js";
import ChannelPartner from "../Models/ChannelPartner.js";

const calculateStartDate = (interval) => {
  const now = new Date();
  let startDate;

  switch (interval) {
    case "daily":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      break;
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0);
  }

  return startDate;
};

export const getNumberOfDirectVisitors = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  const allDirectVisitors = await Customer.find({
    createdAt: { $gte: startDate },
  });

  const numberOfDirectVisitors = allDirectVisitors.length;

  if (numberOfDirectVisitors === 0) {
    return res.status(404).json({ message: "Direct Visitors not found!" });
  }

  res.status(200).json({ numberOfDirectVisitors });
});

export const getNumberOfChannelVisitors = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  const allChannelVisitors = await ChannelPartner.find({
    createdAt: { $gte: startDate },
  });

  const numberOfChannelVisitors = allChannelVisitors.length;

  if (numberOfChannelVisitors === 0) {
    return res.status(404).json({ message: "Channel Visitors not found!" });
  }

  res.status(200).json({ numberOfChannelVisitors });
});

export const getTotalMeetings = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  const startDate = calculateStartDate(interval);

  const allAttendants = await Attendant.find({
    createdAt: { $gte: startDate },
  });

  const totalMeetings = allAttendants.reduce((total, attendant) => {
    return total + (attendant.ClientName ? attendant.ClientName.length : 0);
  }, 0);

  res.status(200).json({ totalMeetings });
});

export const DealsClosed = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  try {
    const startDate = calculateStartDate(interval);

    const allAttendants = await Attendant.find({
      createdAt: { $gte: startDate },
    });

    const totalClientConversion = allAttendants.reduce((total, attendant) => {
      return total + attendant.clientConversion;
    }, 0);

    console.log(totalClientConversion);
    res.status(200).json({ totalClientConversion });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const onlineEmployStatus = asyncHandler(async (req, res) => {
  const { interval } = req.query;
  try {
    const startDate = calculateStartDate(interval);
    const allAttendants = await Attendant.find({
      updatedAt: { $gte: startDate },
    });

    const totalStatus = allAttendants.reduce((total, attendant) => {
      return total + (attendant.StaffStatus === "online" ? 1 : 0);
    }, 0);

    res.status(200).json({ totalStatus });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
