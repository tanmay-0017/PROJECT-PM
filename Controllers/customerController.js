import Customer from '../Models/customer.js';
import asyncHandler from '../utils/asyncHandler.js';


export const createCustomer = asyncHandler(async (req, res) => {
    const { name, email, mobile, projectName, projectLocation  } = req.body;
    const customer = new Customer({ name, email, mobile, projectName, projectLocation});
    await customer.save();
    res.status(201).json(customer);
});


export const getCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find();
    res.status(200).json(customers);
});


export const getCustomerById = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
});


export const updateCustomer = asyncHandler(async (req, res) => {
    const { name, email, mobile } = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id, { name, email, mobile }, { new: true, runValidators: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
});


export const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted' });
});
