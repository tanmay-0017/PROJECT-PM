import Attendant from "../Models/Attendant.js";
import Partner from "../Models/ChannelPartner.js";
import Customer from "../Models/customer.js";
import asyncHandler from "../utils/asyncHandler.js";
/*
const parseTimeString = (timeString) => {
  // Assuming the format is "30 Jul | 05:57 PM"
  const [datePart, timePart] = timeString.split(" | ");
  const [day, month] = datePart.split(" ");
  const [hour, minute] = timePart.split(":");
  const isPM = timePart.includes("PM");

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  let hour24 = parseInt(hour, 10);
  if (isPM && hour24 !== 12) hour24 += 12;
  if (!isPM && hour24 === 12) hour24 = 0;

  return new Date(
    new Date().getFullYear(),
    monthMap[month],
    parseInt(day, 10),
    hour24,
    parseInt(minute, 10)
  );
};
*/
const parseTimeString = (timeString) => {
  if (typeof timeString !== "string") {
    throw new TypeError(`Expected a string but received ${typeof timeString}`);
  }

  // Assuming the format is "30 Jul | 05:57 PM"
  const parts = timeString.split(" | ");
  if (parts.length !== 2) {
    throw new Error(
      "Invalid timeString format. Expected format: '30 Jul | 05:57 PM'"
    );
  }

  const [datePart, timePart] = parts;
  const [day, month] = datePart.split(" ");
  const [hour, minute] = timePart.split(":");
  const isPM = timePart.includes("PM");

  if (!day || !month || !hour || !minute) {
    throw new Error("Incomplete timeString components");
  }

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  if (!(month in monthMap)) {
    throw new Error(`Invalid month: ${month}`);
  }

  let hour24 = parseInt(hour, 10);
  if (isPM && hour24 !== 12) hour24 += 12;
  if (!isPM && hour24 === 12) hour24 = 0;

  return new Date(
    new Date().getFullYear(),
    monthMap[month],
    parseInt(day, 10),
    hour24,
    parseInt(minute, 10)
  );
};

const TimeCalcul = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { StartTime, EndTime } = req.body;

  if (!StartTime || !EndTime) {
    return res
      .status(400)
      .json({ error: "StartTime and EndTime are required" });
  }

  const customer =
    (await Customer.findOne({ customerId: customerId })) ||
    (await Partner.findOne({ partnerId: customerId }));

  console.log("customer", customer);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const InTime = customer.createdAt;
  const attendantId = customer.attendant._id;
  const attendantData = await Attendant.findById(attendantId);
  if (!attendantData) {
    return res.status(404).json({ error: "Attendant not found" });
  }
  const OutTime = attendantData.updatedAt;

  const calculateTimeDifference = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    // return `${diffHrs}:${diffMins}`;
    const paddedHrs = String(diffHrs).padStart(2, "0");
    const paddedMins = String(diffMins).padStart(2, "0");
    return `${paddedHrs}:${paddedMins}`;
  };

  try {
    const startDate = parseTimeString(StartTime);
    const endDate = parseTimeString(EndTime);

    const timeDuration = calculateTimeDifference(startDate, endDate);
    console.log("Time difference", typeof timeDuration);
    const customerUpdate =
      (await Customer.findByIdAndUpdate(
        customer._id,
        {
          timeDuration,
        },
        { new: true }
      )) ||
      (await Partner.findByIdAndUpdate(
        customer._id,
        {
          timeDuration,
        },
        { new: true }
      ));

    res.status(200).json(customerUpdate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { TimeCalcul };
