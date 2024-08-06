import asyncHandler from "../utils/asyncHandler.js";
import Attendant from "../Models/Attendant.js";
/*
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
*/

export const acceptClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  try {
    const attendant = await Attendant.findOne({ employeeId });

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    if (attendant.ClientName.length === 0) {
      return res.status(404).json({ message: "No clients to update" });
    }

    const lastClient = attendant.ClientName[attendant.ClientName.length - 1];

    // Update the client status to 'accepted'
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId, "ClientName._id": lastClient._id },
      { $set: { "ClientName.$.accepted": "accepted" } },
      { new: true }
    );

    if (!updatedAttendant) {
      return res
        .status(404)
        .json({ message: "Failed to update client status" });
    }

    // Send the updated attendant as a response
    res.status(200).json(updatedAttendant);
  } catch (error) {
    return res.status(404).json({ message: "Failed to update client status" });
  }
});

export const rejectClient = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  try {
    const attendant = await Attendant.findOne({ employeeId });

    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }
    /*
   const updatedAttendant = await Attendant.findByIdAndUpdate(
     attendant._id,
     {
       "ClientName.$[].accepted": "rejected",
       "ClientName.$[].completed": "notCompleted",
     },
     { new: true }
   );
 */

    if (attendant.ClientName.length === 0) {
      return res.status(404).json({ message: "No clients to update" });
    }

    const lastClient = attendant.ClientName[attendant.ClientName.length - 1];

    // Update the client status to 'accepted'
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId, "ClientName._id": lastClient._id },
      {
        $set: {
          "ClientName.$.accepted": "rejected",
          "ClientName.$.completed": "notCompleted",
          status: "available",
        },
      },
      { new: true }
    );

    if (!updatedAttendant) {
      return res
        .status(404)
        .json({ message: "Failed to update client status" });
    }

    res.status(200).json(updatedAttendant);
  } catch (error) {
    return res.status(404).json({ message: "Failed to update client status" });
  }
});

export const attendantMeetingOver = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const attendant = await Attendant.findOne({ employeeId });

  try {
    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // const updatedAttendant = await Attendant.findByIdAndUpdate(
    //   attendant._id,
    //   {
    //     endTime: Date.now(),
    //     "ClientName.$[].completed": "completed",
    //     status: "available",
    //   },
    //   { new: true }
    // );
    if (attendant.ClientName.length === 0) {
      return res.status(404).json({ message: "No clients to update" });
    }

    const lastClient = attendant.ClientName[attendant.ClientName.length - 1];

    // Update the client status to 'accepted'
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId, "ClientName._id": lastClient._id },
      {
        $set: {
          "ClientName.$.completed": "completed",
          status: "available",
        },
      },
      { new: true }
    );

    if (!updatedAttendant) {
      return res
        .status(404)
        .json({ message: "Failed to update client status" });
    }
    res.status(200).json(updatedAttendant);
  } catch (error) {
    res.status(404).json({ message: "Failed to update client status" });
  }
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
