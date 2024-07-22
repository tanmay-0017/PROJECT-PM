import Customer from "../Models/customer.js";
import asyncHandler from "../utils/asyncHandler.js";
import Attendant from "../Models/Attendant.js";
import Project from "../Models/projectModel.js";
import { v4 as uuidv4 } from "uuid";

export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, mobile, projectName, projectLocation, notes } = req.body;
  const mobileFound = await Customer.findOne({ mobile });
  if (mobileFound) {
    // return res.status(400).json({ message: 'This customer already exits.' });
    // if (mobileFound.name != name) return res.status(400).json({ message: 'Customer Name does not match' });
    const project = await Project.findOne({ name: projectName });
    if (!project) {
      return res.status(400).json({ message: "Project not found." });
    }
    const teams = project.teams;

    const availableAttendant = await Attendant.findOneAndUpdate(
      { status: "available", team: { $in: teams } },
      {
        status: "assigned",
      },
      { new: true }
    );

    const AttendantData = await Attendant.findByIdAndUpdate(
      availableAttendant._id,
      {
        $push: {
          ClientName: {
            ClientName: name,
            ClientId: mobileFound.customerId,
          },
        },
      },
      { new: true }
    );

    console.log(AttendantData);
    if (!availableAttendant && AttendantData) {
      return res
        .status(400)
        .json({ message: "No available attendants of same team." });
    }

    // Customer.create({
    //     name,
    //     email,
    //     mobile,
    //     projectName,
    //     projectLocation,
    //     customerId: mobileFound.customerId,
    //     attendant: availableAttendant._id,
    //     attendantName: availableAttendant.name,
    //     team: availableAttendant.team
    // })

    const updatedCustomer = await Customer.findByIdAndUpdate(
      mobileFound._id,
      {
        $set: {
          name,
          email,
          mobile,
          projectName,
          projectLocation,
          customerId: mobileFound.customerId,
          attendant: availableAttendant._id,
          attendantName: availableAttendant.name,
          team: availableAttendant.team,
          notes,
        },
        $push: {
          log: {
            projectName,
            projectLocation,
            attendant: availableAttendant._id,
            attendantName: availableAttendant.name,
            team: availableAttendant.team,
          },
        },
      },
      { new: true }
    );

    return res.status(201).json(updatedCustomer);
  }
  // const customerId = uuidv4();

  const customers = await Customer.find({});
  // const customerId = `ROFC${(customers.length + 1).toString()}`;

  // var i = 1;
  // while (Customer.findOne({customerId: customerId})){
  //     customerId = `ROFC${(customers.length + i).toString()}`;
  //     i++;
  // }

  const lastCustomer = await Customer.findOne().sort({ $natural: -1 });
  let customerId;
  if (lastCustomer) {
    const lastCustomerIdNum = parseInt(lastCustomer.customerId.substring(4));
    customerId = `ROFC${(lastCustomerIdNum + 1).toString()}`;
  } else {
    customerId = "ROFC1";
  }

  // const lastCustomer = await Customer.findOne().sort({ customerId: -1 });
  // console.log(lastCustomer);
  // let newCustomerId;
  // if (lastCustomer) {
  //     const lastIdNum = parseInt(lastCustomer.customerId.substr(4));
  //     newCustomerId = `ROFC${(lastIdNum + 1).toString()}`;
  // } else {
  //     newCustomerId = 'ROFC1';
  // }

  const project = await Project.findOne({ name: projectName });
  if (!project) {
    return res.status(400).json({ message: "Project not found." });
  }
  const teams = project.teams;

  const availableAttendant = await Attendant.findOneAndUpdate(
    { status: "available", team: { $in: teams } },
    {
      status: "assigned",
    },
    { new: true }
  );

  console.log("availableAttendant", availableAttendant);
  if (!availableAttendant) {
    return res
      .status(400)
      .json({ message: "No available attendants of same team." });
  }
  const AttendantData = await Attendant.findByIdAndUpdate(
    availableAttendant._id,
    {
      $push: {
        ClientName: {
          ClientName: name,
          ClientId: customerId,
        },
      },
    },
    { new: true }
  );

  Customer.create({
    name,
    email,
    mobile,
    projectName,
    projectLocation,
    customerId,
    attendant: availableAttendant._id,
    attendantName: availableAttendant.name,
    team: availableAttendant.team,
    notes,
    log: [
      {
        projectName,
        projectLocation,
        attendant: availableAttendant._id,
        attendantName: availableAttendant.name,
        team: availableAttendant.team,
      },
    ],
  });
  res.status(201).json({
    name,
    email,
    mobile,
    projectName,
    projectLocation,
    customerId,
    attendantName: availableAttendant.name,
    team: availableAttendant.team,
    notes,
    log: [
      {
        projectName,
        projectLocation,
        attendant: availableAttendant._id,
        attendantName: availableAttendant.name,
        team: availableAttendant.team,
      },
    ],
  });
});

// export const createCustomer = asyncHandler(async (req, res) => {
//     const { name, email, mobile, projectName, projectLocation } = req.body;
//     const mobileFound = await Customer.findOne({ mobile });

//     let customerId;
//     if (mobileFound) {
//         if (mobileFound.name !== name) {
//             return res.status(400).json({ message: 'Customer Name does not match' });
//         }
//         customerId = mobileFound.customerId;
//     } else {
//         const lastCustomer = await Customer.findOne().sort({ $natural: -1 });
//         if (lastCustomer) {
//             const lastCustomerIdNum = parseInt(lastCustomer.customerId.substring(4));
//             customerId = `ROFC${(lastCustomerIdNum + 1).toString()}`;
//         } else {
//             customerId = 'ROFC1';
//         }
//     }

//     const project = await Project.findOne({ name: projectName });
//     if (!project) {
//         return res.status(400).json({ message: 'Project not found.' });
//     }

//     const teams = project.teams;

//     const availableAttendant = await Attendant.findOneAndUpdate(
//         { status: 'available', team: { $in: teams } },
//         { status: 'assigned' },
//         { new: true }
//     );

//     if (!availableAttendant) {
//         return res.status(400).json({ message: 'No available attendants of same team.' });
//     }

//     const newCustomer = await Customer.create({
//         name,
//         email,
//         mobile,
//         projectName,
//         projectLocation,
//         customerId,
//         attendant: availableAttendant._id,
//         attendantName: availableAttendant.name,
//         team: availableAttendant.team,
//         log: mobileFound ? mobileFound.log.concat({
//             projectName,
//             projectLocation,
//             attendant: availableAttendant._id,
//             attendantName: availableAttendant.name,
//             team: availableAttendant.team,
//         }) : [{
//             projectName,
//             projectLocation,
//             attendant: availableAttendant._id,
//             attendantName: availableAttendant.name,
//             team: availableAttendant.team,
//         }]
//     });

//     res.status(201).json(newCustomer);
// });

export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find()
    .populate("attendant", "name")
    .sort({ updatedAt: -1 });
  res.status(200).json(customers);
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const registeredCustomer = await Customer.find({
    customerId: req.params.id,
  }).populate("attendant", "name");
  if (!registeredCustomer)
    return res.status(404).json({ message: "Customer not found" });
  res.status(200).json(registeredCustomer);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const { name, email, notes } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name, email, notes },
    { new: true, runValidators: true }
  );
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  await Attendant.findByIdAndUpdate(customer.attendant, {
    status: "available",
  });

  res.status(200).json(customer);
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.status(200).json({ message: "Customer deleted" });
});
