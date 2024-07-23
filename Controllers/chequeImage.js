import Partner from "../Models/ChannelPartner.js";
import Customer from "../Models/customer.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const ChequeImage = asyncHandler(async (req, res) => {
  const {
    name,
    mobile,
    projectName,
    customerId,
    customerName,
    customerMobileLastFour,
    partnerId,
  } = req.body;

  if (!req.files || !req.files?.chequeImage || !req.files?.chequeImage[0]) {
    return res.status(400).json({ message: "Cheque Image file is required" });
  }

  const chequeImageLocalPath = req.files.chequeImage[0].path;
  console.log(chequeImageLocalPath);
  // Upload the image to Cloudinary
  const chequeImageUpload = await uploadOnCloudinary(chequeImageLocalPath);
  console.log(chequeImageUpload);

  const findUserscustomer = await Customer.findOne({ customerId });
  const findUserspartner = await Partner.findOne({ partnerId });

  if (!findUserscustomer && !findUserspartner) {
    return res.status(404).json({ message: "Customer or Partner not found" });
  }

  let updatedChequeImage;

  if (findUserscustomer) {
    updatedChequeImage = await Customer.findByIdAndUpdate(
      findUserscustomer._id,
      {
        $set: {
          name,
          mobile,
          projectName,
          customerId: findUserscustomer.customerId,
        },
        $push: {
          chequeImage: {
            chequeImages: chequeImageUpload.url,
          },
        },
      },
      { new: true }
    );
  }

  if (findUserspartner) {
    updatedChequeImage = await Partner.findByIdAndUpdate(
      findUserspartner._id,
      {
        $set: {
          customerName,
          customerMobileLastFour,
          projectName,
          partnerId: findUserspartner.partnerId,
        },
        $push: {
          chequeImage: {
            chequeImages: chequeImageUpload.url,
          },
        },
      },
      { new: true }
    );
  }

  res.status(201).json(updatedChequeImage);
});




export const getChequeImages = asyncHandler(async (req, res) => {
  const { customerId, partnerId } = req.query;

  let user;
  if (customerId) {
    user = await Customer.findOne({ customerId });
  } else if (partnerId) {
    user = await Partner.findOne({ partnerId });
  }

  if (!user) {
    return res.status(404).json({ message: "Customer or Partner not found" });
  }

  res.status(200).json(user);
});

// GET Handler for all cheques
export const getAllCheques = asyncHandler(async (req, res) => {
  const customers = await Customer.find({}).select('chequeImage createdAt').lean();
  const partners = await Partner.find({}).select('chequeImage createdAt').lean();

  const allCheques = [
    ...customers.map(customer => ({
      type: 'customer',
      id: customer._id,
      chequeImage: customer.chequeImage,
      createdAt: customer.createdAt,
    })),
    ...partners.map(partner => ({
      type: 'partner',
      id: partner._id,
      chequeImage: partner.chequeImage,
      createdAt: partner.createdAt,
    })),
  ];

  // Sort by createdAt in descending order
  allCheques.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json(allCheques);
});
