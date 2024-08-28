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

//delete the employee log in client history

export const deleteHistory = asyncHandler(async (req, res) => {
  const { employeeId, clientId } = req.params;

  try {
    // Find the attendant by employeeId and update the ClientName array
    const result = await Attendant.updateOne(
      { employeeId, "ClientName.ClientId": clientId },
      { $pull: { ClientName: { ClientId: clientId } } }
    );
    console.log(result); // Debugging line

    // Check if a document was modified
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Client deleted successfully" });
    } else {
      res.status(404).json({ message: "Client not found or already deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//update the employee log in client history

// export const UpdatesHistory = asyncHandler(async (req, res) => {
//   const { employeeId, clientId } = req.params;
//   const { name, Email, project, note } = req.body;

//   try {
//     // Find the attendant by employeeId and update the ClientName array
//     const result = await Attendant.updateOne(
//       { employeeId, "ClientName.ClientId": clientId },
//       {
//         $set: {
//           ClientName: {
//             ClientName: name,
//             ClientEmail: Email,
//             ClientProject: project,
//             notes: note,
//           },
//         },
//       },
//       { new: true }
//     );
//     console.log(result); // Debugging line

//     // Check if a document was modified
//     res.status(200).json({ message: "Client deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

export const UpdatesHistory = asyncHandler(async (req, res) => {
  const { employeeId, clientId } = req.params;
  const { name, Email, project, note } = req.body;

  try {
    // Find the attendant by employeeId and update the specific element in the ClientName array
    const result = await Attendant.updateOne(
      { employeeId, "ClientName.ClientId": clientId },
      {
        $set: {
          "ClientName.$.ClientName": name,
          "ClientName.$.ClientEmail": Email,
          "ClientName.$.ClientProject": project,
          "ClientName.$.notes": note,
        },
      }
    );

    console.log(result); // Debugging line

    // Check if a document was modified
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Update successful", result });
    } else {
      res.status(404).json({ message: "No matching client found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
