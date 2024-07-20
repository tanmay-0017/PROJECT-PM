import Partner from "../Models/ChannelPartner.js";
import Customer from "../Models/customer.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
/*
//! Error code 
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

  console.log("findUsers", findUsers);
  const updatedChequeImage =
    (await Customer.findByIdAndUpdate(
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
    )) ||
    (await Partner.findByIdAndUpdate(
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
    ));

  res.status(201).json(updatedChequeImage);
});
*/

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
