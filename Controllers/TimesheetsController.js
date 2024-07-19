import Attendant from "../Models/Attendant.js";
import Customer from "../Models/customer.js";
import asyncHandler from "../utils/asyncHandler.js";

const TimeCalcul = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const customer = await Customer.findOne({ customerId });

  const InTime = customer.createdAt;

  const attendantId = customer.attendant._id;

  const attendantData = await Attendant.findById(attendantId);

  const OutTime = attendantData.updatedAt;
  function calculateTimeDifference(clockOut, clockIn) {
    const diffMs = clockOut - clockIn;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    return `${diffHrs}:${diffMins}`;
  }

  const timeDuration = calculateTimeDifference(OutTime, InTime);
  let time = calculateTimeDifference(OutTime, InTime);
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
