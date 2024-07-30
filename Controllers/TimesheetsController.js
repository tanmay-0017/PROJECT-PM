import Attendant from "../Models/Attendant.js";
import Customer from "../Models/customer.js";
import asyncHandler from "../utils/asyncHandler.js";

const TimeCalcul = asyncHandler(async (req, res) => {
  const { StartTime, EndTime, customerId } = req.body;
  const customer = await Customer.findOne({ customerId });

  const attendantId = customer.attendant._id;

  const attendantData = await Attendant.findById(attendantId);

  function calculateTimeDifference(clockOut, clockIn) {
    const diffMs = clockOut - clockIn;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    return `${diffHrs}:${diffMins}`;
  }

  const timeDuration = calculateTimeDifference(EndTime, StartTime);
  let time = calculateTimeDifference(EndTime, StartTime);
  const customerUpdate = await Customer.findByIdAndUpdate(
    customer._id,
    {
      timeDuration,
    },
    { new: true }
  );
  console.log(customerUpdate);
  res.status(200).json(customerUpdate);
});

export { TimeCalcul };
